import { useState } from 'react';
import { useParams } from 'react-router-dom';

const ClaimDetails = () => {
  const { claimId } = useParams();
  const [status, setStatus] = useState('Pending');

  const claimData = {
    id: claimId,
    policyHolder: 'John Doe',
    amount: 1500,
    status: 'Pending',
    description: 'Car accident, rear-ended by another vehicle.',
    documents: [
      { name: 'Accident Report', type: 'PDF', url: '#' },
      { name: 'Photos of the Accident', type: 'Image', url: '#' }
    ],
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-10 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-xl w-full max-w-4xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC] mb-6 text-center">
          Claim Details - {claimData.id}
        </h2>

        <div className="mb-6 space-y-2 text-base sm:text-lg">
          <p><span className="font-semibold">Policy Holder:</span> {claimData.policyHolder}</p>
          <p><span className="font-semibold">Claim Amount:</span> ${claimData.amount}</p>
          <p><span className="font-semibold">Status:</span> {claimData.status}</p>
          <p><span className="font-semibold">Description:</span> {claimData.description}</p>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Uploaded Documents:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {claimData.documents.map((doc, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <p className="font-semibold text-base">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.type}</p>
              <a href={doc.url} className="text-blue-600 mt-2 inline-block text-sm hover:underline">View Document</a>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 sm:gap-6">
          <button
            onClick={() => setStatus('Approved')}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Approve Claim
          </button>
          <button
            onClick={() => setStatus('Rejected')}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Reject Claim
          </button>
        </div>

        {status !== claimData.status && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-800">Claim Status Updated: {status}</p>
            <p className="text-sm text-gray-500">The claim status has been updated to {status}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDetails;
