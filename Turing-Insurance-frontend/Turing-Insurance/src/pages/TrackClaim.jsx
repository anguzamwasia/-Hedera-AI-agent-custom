import { useState } from 'react';
import pic1 from '../assets/pic1.jpg';

const TrackClaim = () => {
  const [claimId, setClaimId] = useState('');
  const [status, setStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (claimId === 'CLM00123') {
      setStatus('Pending Review');
    } else if (claimId === 'CLM00122') {
      setStatus('Approved');
    } else {
      setStatus('Claim not found');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10"
      style={{
        backgroundImage: `url(${pic1})`,
      }}
    >
      <div className="backdrop-blur-md bg-white/80 rounded-xl shadow-xl p-6 sm:p-10 w-full max-w-md sm:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC] mb-6 text-center">
          Track Your Claim
        </h2>
        <form onSubmit={handleTrack} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Claim ID"
            value={claimId}
            onChange={(e) => setClaimId(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-[#0052CC] text-white py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-[#0041a8] transition"
          >
            Check Status
          </button>
        </form>
        {status && (
          <div className="mt-6 text-center text-base sm:text-lg font-medium text-[#2C3E50]">
            Status: <span className="text-[#0091B6]">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackClaim;
