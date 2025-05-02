import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiX, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history and check network status on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('hederaInsuranceChat');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
    checkNetworkStatus();
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('hederaInsuranceChat', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Check Hedera network status
  const checkNetworkStatus = async () => {
    try {
      const res = await axios.get('/api/network-status');
      setNetworkStatus(res.data);
    } catch (e) {
      setNetworkStatus({ status: 'offline' });
    }
  };

  // Get account balance
  const getAccountBalance = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/account/balance');
      const balanceMessage = {
        text: `💰 Account Balance: ${response.data.balance} HBAR\nAccount ID: ${response.data.account_id}`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isBalanceInfo: true
      };
      setMessages(prev => [...prev, balanceMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Error fetching account balance',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format Hedera-specific responses
  const formatHederaResponse = (text) => {
    if (typeof text !== 'string') return text;
    
    return text.split('\n').map((line, i) => {
      if (line.includes('💰 Account Balance')) {
        return (
          <div key={i} className="balance-message">
            <p className="balance-line">
              <span className="hbar-icon">ℏ</span> 
              {line.replace('💰 Account Balance:', 'Account Balance:')}
            </p>
            <button 
              onClick={getAccountBalance}
              className="refresh-balance-btn"
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
          </div>
        );
      }
      if (line.includes('Account ID:')) {
        return <p key={i} className="account-id">{line}</p>;
      }
      if (line.includes('HCS') || line.includes('HIP') || line.includes('HBAR')) {
        return <p key={i} className="hedera-term">{line}</p>;
      }
      return <p key={i}>{line}</p>;
    });
  };

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Check if user is asking for balance
    if (inputMessage.toLowerCase().includes('balance')) {
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      await getAccountBalance();
      return;
    }

    const tempTxId = `temp-${Date.now()}`;
    const optimisticResponse = {
      text: "Processing your claim on Hedera...",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      isOptimistic: true,
      tempTxId
    };

    setMessages(prev => [...prev, userMessage, optimisticResponse]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/process-claim', {
        claim_details: inputMessage
      });

      setMessages(prev => prev.map(msg => 
        msg.tempTxId === tempTxId ? {
          text: response.data.message,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isHederaData: !!response.data.hederaData,
          balance: response.data.hederaData ? `Sequence ${response.data.hederaData.sequenceNumber}` : null,
          topicId: response.data.hederaData?.topicId || null
        } : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.tempTxId === tempTxId ? {
          text: 'Error processing claim. Please try again.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('hederaInsuranceChat');
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#0052CC] text-white p-4 rounded-full shadow-lg hover:bg-[#003d99] transition-all duration-300 z-50"
          aria-label="Open chat"
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {/* Chat container */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 animate-fade-in">
          {/* Header */}
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

          {/* Network status indicator */}
          {networkStatus && (
            <div className={`px-4 py-2 text-xs flex items-center justify-between ${
              networkStatus.status === 'operational' ? 'bg-green-50 text-green-800' :
              networkStatus.status === 'degraded' ? 'bg-yellow-50 text-yellow-800' :
              'bg-red-50 text-red-800'
            }`}>
              <span>
                Hedera Network: {networkStatus.status || 'unknown'}
                {networkStatus.mainNodeLatency && (
                  <span className="ml-2">
                    {Math.round(networkStatus.mainNodeLatency * 1000)}ms
                  </span>
                )}
              </span>
              <button onClick={checkNetworkStatus} className="hover:opacity-70">
                <FiRefreshCw size={14} />
              </button>
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[60vh] bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="font-medium mb-2">Welcome to Hedera Claims Assistant</p>
                <p className="text-sm mb-4">Ask me about insurance claims or your account balance</p>
                <button
                  onClick={getAccountBalance}
                  className="px-4 py-2 bg-[#0052CC] text-white rounded-lg text-sm hover:bg-[#003d99] transition-colors"
                >
                  Check My HBAR Balance
                </button>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block px-4 py-3 rounded-lg max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'bg-[#0052CC] text-white' 
                        : msg.isError
                          ? 'bg-red-100 text-red-800'
                          : msg.isOptimistic
                            ? 'bg-gray-100 text-gray-800 message-optimistic'
                            : msg.isBalanceInfo
                              ? 'bg-[#e6f2ff] text-[#0052CC] border border-[#0052CC]/20 balance-info'
                              : 'bg-[#e6f2ff] text-[#0052CC] border border-[#0052CC]/20'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.sender === 'bot' ? formatHederaResponse(msg.text) : msg.text}
                    </div>
                    <div className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-white/70' : 
                      msg.isError ? 'text-red-600' : 'text-[#0052CC]'
                    }`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                    {msg.balance && (
                      <div className="text-xs mt-1 text-[#0052CC]">
                        Transaction Sequence: {msg.balance}
                      </div>
                    )}
                    {msg.topicId && (
                      <div className="text-xs mt-1 text-[#0052CC]">
                        Topic ID: {msg.topicId}
                      </div>
                    )}
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
                    <span className="text-sm">Processing request...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`p-2 rounded-lg ${
                  isLoading || !inputMessage.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0052CC] text-white hover:bg-[#003d99]'
                }`}
                aria-label="Send message"
              >
                <FiSend size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "Check my balance" or describe your insurance claim
            </p>
          </form>
        </div>
      )}

      {/* Inline styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .message-optimistic {
          animation: pulse 1.5s infinite;
        }
        .balance-message {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .balance-line {
          display: flex;
          align-items: center;
          font-weight: bold;
          margin-top: 8px;
        }
        .hbar-icon {
          color: #00B8D9;
          font-weight: bold;
          margin-right: 6px;
        }
        .hedera-term {
          color: #0052CC;
          font-weight: 500;
        }
        .account-id {
          font-size: 0.75rem;
          color: #666;
          margin-top: 4px;
        }
        .refresh-balance-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: #0052CC;
          font-size: 0.75rem;
          cursor: pointer;
          margin-top: 4px;
        }
        .refresh-balance-btn:hover {
          text-decoration: underline;
        }
        .balance-info {
          background: #f0f7ff !important;
        }
      `}</style>
    </>
  );
};

export default Chatbox;