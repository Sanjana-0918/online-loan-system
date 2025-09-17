import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { payMonthly, payFull } from "../features/loansSlice";
import { logout } from "../features/authSlice";

function calcPenalty(dueDateISO, remaining, dailyRate) {
  const today = new Date();
  const due = new Date(dueDateISO);
  if (today <= due) return 0;
  const diffMs = today - due;
  const daysLate = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const penalty = remaining * dailyRate * daysLate;
  return Math.round(penalty * 100) / 100;
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const loans = useSelector((s) => s.loans.loans) || []; // ✅ fallback to []
  const dailyRate = useSelector((s) => s.loans.dailyPenaltyRate ?? 0.01);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ✅ safeguard so .filter doesn’t break
  const myLoans = Array.isArray(loans)
    ? loans.filter(
        (l) =>
          l.owner ===
          (currentUser?.username ?? currentUser?.email ?? currentUser)
      )
    : [];

  // compute categories
  const now = new Date();
  const overdue = [];
  const upcoming = [];
  let remainingTotal = 0;

  myLoans.forEach((loan) => {
    const penalty = calcPenalty(loan.dueDate, loan.remainingAmount, dailyRate);
    const loanWithPenalty = { ...loan, penalty };

    remainingTotal += loan.remainingAmount;

    const dueDate = new Date(loan.dueDate);
    if (loan.paid || loan.remainingAmount <= 0) {
      // skip
    } else if (now > dueDate) {
      overdue.push(loanWithPenalty);
    } else {
      upcoming.push(loanWithPenalty);
    }
  });

  const handlePayMonthly = (loanId) => {
    dispatch(payMonthly({ loanId }));
  };

  const handlePayFull = (loanId) => {
    dispatch(payFull({ loanId }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">
            Welcome,{" "}
            <span className="font-semibold text-indigo-400">
              {currentUser?.username || currentUser?.email}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/apply"
            className="bg-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Apply for Loan
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Remaining Loans</h3>
          <p className="text-xl">₹ {remainingTotal.toFixed(2)}</p>
          <small className="text-gray-400">Total remaining principal</small>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Upcoming Payments</h3>
          {upcoming.length === 0 ? (
            <p className="text-gray-400">No upcoming payments</p>
          ) : (
            upcoming.map((l) => (
              <div key={l.id} className="border-b border-gray-700 py-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-sm text-gray-400">
                      Due: {new Date(l.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>₹ {l.monthlyInstallment.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">
                      Rem: ₹ {l.remainingAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handlePayMonthly(l.id)}
                    className="bg-indigo-600 px-3 py-1 rounded text-sm"
                  >
                    Pay Monthly
                  </button>
                  <button
                    onClick={() => handlePayFull(l.id)}
                    className="bg-green-600 px-3 py-1 rounded text-sm"
                  >
                    Pay Full
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Overdue Payments</h3>
          {overdue.length === 0 ? (
            <p className="text-gray-400">No overdue payments</p>
          ) : (
            overdue.map((l) => (
              <div key={l.id} className="border-b border-gray-700 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-sm text-gray-400">
                      Due: {new Date(l.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-red-400 font-semibold">
                      Penalty: ₹ {l.penalty.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>Rem: ₹ {l.remainingAmount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handlePayMonthly(l.id)}
                    className="bg-indigo-600 px-3 py-1 rounded text-sm"
                  >
                    Pay Monthly
                  </button>
                  <button
                    onClick={() => handlePayFull(l.id)}
                    className="bg-green-600 px-3 py-1 rounded text-sm"
                  >
                    Pay Full
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* All Loans */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">All My Loans</h3>
        {myLoans.length === 0 ? (
          <p className="text-gray-400">You have no loans yet.</p>
        ) : (
          myLoans.map((l) => (
            <div key={l.id} className="py-2 border-b border-gray-700">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-gray-400">
                    Started: {new Date(l.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div>Remaining: ₹ {l.remainingAmount.toFixed(2)}</div>
                  <div
                    className={`text-sm ${
                      l.paid ? "text-green-400" : "text-yellow-300"
                    }`}
                  >
                    {l.paid ? "Paid" : "Active"}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
