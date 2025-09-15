import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import loansReducer from "../features/loansSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loans: loansReducer,
  },
});

export default store;
