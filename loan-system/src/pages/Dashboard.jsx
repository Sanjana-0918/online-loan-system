import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/apply"
          className="bg-indigo-600 px-4 py-2 rounded-lg font-medium"
        >
          Apply for Loan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow">Remaining Loans</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          Upcoming Payments
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          Overdue Payments
        </div>
      </div>
    </div>
  );
}
