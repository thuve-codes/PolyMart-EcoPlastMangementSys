import { configureStore } from "@reduxjs/toolkit";
import adminStatsReducer from "./reducers/adminReducer"; // Ensure correct path

const store = configureStore({
    reducer: {
        adminStats: adminStatsReducer,
    },
});

export default store;

