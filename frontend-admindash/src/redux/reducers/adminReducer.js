import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "adminStats",
    initialState: {
        stats: {},
    },
    reducers: {
        setAdminStats: (state, action) => {
            state.stats = action.payload;
        },
    },
});

export const { setAdminStats } = adminSlice.actions;
export default adminSlice.reducer;
