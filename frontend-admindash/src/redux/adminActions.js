import axios from "axios";

export const getAdminStats = () => async (dispatch) => {
    try {
        const { data } = await axios.get("/api/admin/stats");
        dispatch({ type: "GET_ADMIN_STATS_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "GET_ADMIN_STATS_FAIL", payload: error.response.data.message });
    }
};
