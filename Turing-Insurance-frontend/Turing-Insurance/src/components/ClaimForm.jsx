import { submitClaim } from '../services/hedera';
import { useState, useEffect } from 'react';


export default function ClaimForm() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    listenForClaims((message) => {
      setStatus(`New update: ${message.status}`);
    });
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await submitClaim({
        ...formData,
        type: 'AUTO_CLAIM'
      });
      setStatus(`Submitted! TX ID: ${response.txId}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Your existing form fields */}
      <button onClick={handleSubmit}>Submit Claim</button>
      <div className="status">{status}</div>
    </div>
  );
}