import { createSlice } from "@reduxjs/toolkit";

// localStorage helpers
const LS_KEY = "loans";
const loadLoans = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveLoans = (loans) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(loans));
  } catch {}
};

// default daily penalty rate (1% of remaining per day)
const DEFAULT_DAILY_RATE = 0.01;

const initialState = {
  loans: loadLoans(),
  dailyPenaltyRate: DEFAULT_DAILY_RATE,
};

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    applyLoan: (state, action) => {
      // payload: { owner, name, age, amount, tenure }
      const { owner, name, age, amount, tenure } = action.payload;
      const principal = Number(amount);
      const months = Number(tenure);
      const now = new Date();

      // naive dueDate: start + tenure months
      const dueDate = new Date(
        now.getFullYear(),
        now.getMonth() + months,
        now.getDate()
      ).toISOString();

      const newLoan = {
        id: Date.now(),
        owner,
        name,
        age,
        originalAmount: principal,
        remainingAmount: principal,
        tenureMonths: months,
        monthlyInstallment: Math.round((principal / months) * 100) / 100,
        startDate: now.toISOString(),
        dueDate,
        paid: false,
        payments: [], // { date, type: 'monthly'|'full', amount }
      };

      state.loans.push(newLoan);
      saveLoans(state.loans);
    },

    payMonthly: (state, action) => {
      const { loanId } = action.payload;
      const loan = state.loans.find((l) => l.id === loanId);
      if (!loan || loan.paid) return;

      const payAmt = Number(loan.monthlyInstallment);
      loan.remainingAmount =
        Math.round((loan.remainingAmount - payAmt) * 100) / 100;
      loan.payments.push({
        date: new Date().toISOString(),
        type: "monthly",
        amount: payAmt,
      });

      if (loan.remainingAmount <= 0) {
        loan.remainingAmount = 0;
        loan.paid = true;
      }
      saveLoans(state.loans);
    },

    payFull: (state, action) => {
      const { loanId } = action.payload;
      const loan = state.loans.find((l) => l.id === loanId);
      if (!loan || loan.paid) return;

      const payAmt = Number(loan.remainingAmount);
      loan.remainingAmount = 0;
      loan.paid = true;
      loan.payments.push({
        date: new Date().toISOString(),
        type: "full",
        amount: payAmt,
      });
      saveLoans(state.loans);
    },

    setDailyPenaltyRate: (state, action) => {
      state.dailyPenaltyRate = Number(action.payload);
      saveLoans(state.loans);
    },

    clearLoans: (state) => {
      state.loans = [];
      saveLoans([]);
    },
  },
});

export const {
  applyLoan,
  payMonthly,
  payFull,
  setDailyPenaltyRate,
  clearLoans,
} = loansSlice.actions;
export default loansSlice.reducer;
