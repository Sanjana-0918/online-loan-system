import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyLoan } from "../features/loansSlice";
import { useNavigate } from "react-router-dom";

export default function ApplyLoan() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    age: "",
    amount: "",
    tenure: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.auth.currentUser);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.amount || !form.tenure) {
      alert("Please fill all fields.");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to apply.");
      return;
    }

    dispatch(
      applyLoan({
        owner: currentUser.username ?? currentUser.email ?? currentUser,
        name: form.name,
        age: Number(form.age),
        amount: Number(form.amount),
        tenure: Number(form.tenure),
      })
    );

    setForm({ name: "", age: "", amount: "", tenure: "" });
    setStep(1);

    navigate("/dashboard");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        {}
        {step < 3 && (
          <div>
            {step === 1 && (
              <>
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
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
                <button
                  type="button"
                  onClick={next}
                  className="bg-indigo-600 px-4 py-2 rounded"
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl mb-4">Loan Details</h2>
                <input
                  className="w-full p-2 mb-3 rounded bg-gray-700"
                  placeholder="Amount"
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <input
                  className="w-full p-2 mb-3 rounded bg-gray-700"
                  placeholder="Tenure (months)"
                  type="number"
                  min="1"
                  value={form.tenure}
                  onChange={(e) => setForm({ ...form, tenure: e.target.value })}
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prev}
                    className="bg-gray-600 px-4 py-2 rounded"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="bg-indigo-600 px-4 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-400 mt-4">Step {step} of 3</div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl mb-4">Summary</h2>
            <p>
              <strong>Name:</strong> {form.name}
            </p>
            <p>
              <strong>Age:</strong> {form.age}
            </p>
            <p>
              <strong>Amount:</strong> {form.amount}
            </p>
            <p>
              <strong>Tenure:</strong> {form.tenure} months
            </p>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prev}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Back
              </button>
              <button type="submit" className="bg-green-600 px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
