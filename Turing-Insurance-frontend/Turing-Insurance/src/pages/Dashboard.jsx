import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { listenForClaims, getClaimHistory } from '../services/hedera';
import axios from '../Api/axios';
import { FiSend, FiX, FiMessageSquare } from 'react-icons/fi';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Component Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-500 bg-red-50 rounded-lg">
          Component failed to load. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

// Chatbox Component
const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('hederaInsuranceChat');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('hederaInsuranceChat', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/process-claim', {
        claim_details: inputMessage
      });

      const botMessage = {
        text: response.data.result,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isHederaData: response.data.hederaData
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Error processing your claim. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text) => {
    if (text.includes('HCS') || text.includes('HBAR')) {
      return text.split('\n').map((line, i) => {
        if (line.includes('HCS') || line.includes('HBAR')) {
          return <p key={i} className="text-[#0052CC] font-medium">{line}</p>;
        }
        return <p key={i}>{line}</p>;
      });
    }
    return text;
  };

  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('hederaInsuranceChat');
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#0052CC] text-white p-4 rounded-full shadow-lg hover:bg-[#003d99] transition-all duration-300 z-50"
          aria-label="Open chat"
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 animate-fade-in">
          <div className="bg-[#0052CC] text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Hedera Claims Assistant</h3>
              <p className="text-xs opacity-80">Powered by Blockchain AI</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={clearChat}
                className="p-1 text-white hover:text-gray-200 text-sm"
                title="Clear chat"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-[60vh] bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="font-medium mb-2">Welcome to Hedera Claims Assistant</p>
                <p className="text-sm">Ask me about insurance claims,</p>
                <p className="text-sm">HCS topics, or HBAR transactions</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block px-4 py-3 rounded-lg max-w-[80%] ${msg.sender === 'user' 
                      ? 'bg-[#0052CC] text-white' 
                      : msg.isError
                        ? 'bg-red-100 text-red-800'
                        : msg.isHederaData
                          ? 'bg-[#e6f2ff] text-[#0052CC] border border-[#0052CC]/20'
                          : 'bg-gray-100 text-gray-800'}`}
                  >
                    <div className="whitespace-pre-wrap">
                      {formatMessage(msg.text)}
                    </div>
                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block px-4 py-3 rounded-lg bg-gray-100 text-gray-800 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm">Processing claim...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your claim details..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`p-2 rounded-lg ${isLoading || !inputMessage.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0052CC] text-white hover:bg-[#003d99]'}`}
                aria-label="Send message"
              >
                <FiSend size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send. Claims will be processed via Hedera Network.
            </p>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

const DashboardContent = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0
  });
  const [recentClaims, setRecentClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateStats = (claims) => {
    if (!Array.isArray(claims)) {
      console.error('Claims data is not an array:', claims);
      return;
    }
    
    setStats({
      total: claims.length,
      pending: claims.filter(c => c.status === 'PENDING').length,
      approved: claims.filter(c => c.status === 'APPROVED').length
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'text-yellow-500';
      case 'APPROVED': return 'text-green-500';
      case 'DENIED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchInitialData = async () => {
      try {
        const claims = await getClaimHistory();
        if (claims) {
          updateStats(claims);
          setRecentClaims(claims.slice(0, 5));
          setError(null);
        } else {
          throw new Error('No claims data received');
        }
      } catch (err) {
        console.error('Failed to load claims:', err);
        setError('Failed to load claim data');
        setRecentClaims([{
          claimId: "DEMO123",
          status: "PENDING",
          timestamp: new Date().toISOString(),
          txId: "0.0.0"
        }]);
        updateStats([{
          claimId: "DEMO123",
          status: "PENDING"
        }]);
      } finally {
        setLoading(false);
      }
    };

    const setupListeners = () => {
      try {
        unsubscribe = listenForClaims((newClaim) => {
          setRecentClaims(prev => [newClaim, ...prev.slice(0, 4)]);
          updateStats([newClaim, ...recentClaims]);
        });
      } catch (err) {
        console.error('Failed to setup listeners:', err);
      }
    };

    fetchInitialData();
    setupListeners();

    return () => {
      unsubscribe();
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] p-4 sm:p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-red-500 text-lg font-semibold">{error}</h2>
          <p className="mt-2">Using demo data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] p-4 sm:p-6 relative">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#0052CC] mb-6 text-center sm:text-left">
        Welcome Back!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-base sm:text-lg text-gray-600">Total Claims</h2>
          <p className="text-2xl sm:text-3xl font-bold text-[#00B8D9]">
            {loading ? '...' : stats.total}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-base sm:text-lg text-gray-600">Pending</h2>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
            {loading ? '...' : stats.pending}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-base sm:text-lg text-gray-600">Approved</h2>
          <p className="text-2xl sm:text-3xl font-bold text-green-500">
            {loading ? '...' : stats.approved}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#0052CC] mb-4">
          Recent Claims
        </h2>
        {loading ? (
          <div className="text-center py-8">Loading claims...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base text-left table-auto border-collapse">
              <thead className="bg-[#0052CC] text-white">
                <tr>
                  <th className="py-2 px-4">Claim ID</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">TX Hash</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.txId || claim.claimId} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{claim.claimId}</td>
                    <td className={`py-2 px-4 ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(claim.timestamp || new Date()).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      {claim.txId !== "0.0.0" ? (
                        <a 
                          href={`https://hashscan.io/testnet/transaction/${claim.txId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">Demo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <Link
            to="/claim-form"
            className="bg-[#00B8D9] text-white px-5 py-2 rounded hover:bg-[#0091B6] transition text-center w-full sm:w-auto"
          >
            File New Claim
          </Link>
          <Link
            to="/track-claim"
            className="text-[#0052CC] font-semibold hover:underline text-center w-full sm:w-auto"
          >
            Track a Claim
          </Link>
        </div>
      </div>

      <Chatbox />
    </div>
  );
};

const Dashboard = () => (
  <ErrorBoundary>
    <DashboardContent />
  </ErrorBoundary>
);

export default Dashboard;