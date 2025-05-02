import { listenForClaims } from '../services/hedera';
import { useEffect, useState } from 'react';

export default function ClaimStatus({ claimId }) {
  const [status, setStatus] = useState("Pending...");

  useEffect(() => {
    listenForClaims((message) => {
      if (message.claimId === claimId) {
        setStatus(message.status);
      }
    });
  }, [claimId]);

  return <div className="status-badge">{status}</div>;
}