import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../featuers/authSlice";
import blogReducer from "../featuers/blogSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blogReducer,
    },
});

export default store;