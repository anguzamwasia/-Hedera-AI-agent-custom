import { useState } from 'react';

const AdminDashboard = () => {
  const claimsData = [
    { id: 'CLM001', policyHolder: 'John Doe', status: 'Pending', amount: 1000 },
    { id: 'CLM002', policyHolder: 'Jane Smith', status: 'Approved', amount: 2500 },
    { id: 'CLM003', policyHolder: 'Bob Johnson', status: 'Rejected', amount: 1500 },
    { id: 'CLM004', policyHolder: 'Alice White', status: 'Pending', amount: 2000 },
  ];

  const [statusFilter, setStatusFilter] = useState('All');

  const filteredClaims = claimsData.filter((claim) => {
    if (statusFilter === 'All') return true;
    return claim.status === statusFilter;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-10 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-xl w-full max-w-6xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-[#0052CC] mb-8 text-center">Admin Dashboard</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-[#0052CC] text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Claims</h3>
            <p className="text-2xl mt-2">4</p>
          </div>
          <div className="p-6 bg-[#0091B6] text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Pending Claims</h3>
            <p className="text-2xl mt-2">2</p>
          </div>
          <div className="p-6 bg-[#F1C40F] text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Approved Claims</h3>
            <p className="text-2xl mt-2">1</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-lg font-semibold">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg w-full sm:w-auto"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#0052CC] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Claim ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Policy Holder</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Claim Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="border-b">
                  <td className="px-6 py-4 text-sm">{claim.id}</td>
                  <td className="px-6 py-4 text-sm">{claim.policyHolder}</td>
                  <td className="px-6 py-4 text-sm">{claim.status}</td>
                  <td className="px-6 py-4 text-sm">${claim.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
