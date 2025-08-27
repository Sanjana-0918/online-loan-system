import { useState } from "react";

export default function ApplyLoan() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    age: "",
    amount: "",
    tenure: "",
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        {step === 1 && (
          <div>
            <h2 className="text-xl mb-4">Personal Information</h2>
            <input
              className="w-full p-2 mb-3 rounded bg-gray-700"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full p-2 mb-3 rounded bg-gray-700"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <button onClick={next} className="bg-indigo-600 px-4 py-2 rounded">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl mb-4">Loan Details</h2>
            <input
              className="w-full p-2 mb-3 rounded bg-gray-700"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              className="w-full p-2 mb-3 rounded bg-gray-700"
              placeholder="Tenure (months)"
              value={form.tenure}
              onChange={(e) => setForm({ ...form, tenure: e.target.value })}
            />
            <div className="flex justify-between">
              <button onClick={prev} className="bg-gray-600 px-4 py-2 rounded">
                Back
              </button>
              <button
                onClick={next}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
