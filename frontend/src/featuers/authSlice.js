import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode'

const initialState = {
    status: "idle",
    user: localStorage.getItem("access_token") ? jwtDecode(localStorage.getItem("access_token")) : null,
    error: null,
};

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/users/token/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            return {
                access_token: data.access,
                refresh_token: data.refresh,
            };
        } else {
            return rejectWithValue("Failed to log in. Please check your credentials.");
        }
    } catch (error) {
        return rejectWithValue("Network error: Unable to fetch data.");
    }
});


export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
            method: "POST",
            body: userData,
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            localStorage.setItem("access_token", data.tokens.access);
            localStorage.setItem("refresh_token", data.tokens.refresh);

            return {
                access_token: data.tokens.access,
                refresh_token: data.tokens.refresh,
            };
        } else {
            return rejectWithValue("Failed to register. Please check your credentials.");
        }
    } catch (error) {
        return rejectWithValue("Network error: Unable to fetch data.");
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducer: {
        logoutUser: (state) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'success';
            const accessToken = action.payload.access;

            if (accessToken) {
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", action.payload.refresh);
                state.user = jwtDecode(accessToken);
            } else {
                state.error = 'Invalid access token';
            }
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.payload.message;
        });

        builder.addCase(registerUser.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.status = 'success';
            const accessToken = action.payload.access;

            if (accessToken) {
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", action.payload.refresh);
                state.user = jwtDecode(accessToken);
            } else {
                state.error = 'Invalid access token';
            }
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.payload.message;
        });
    }
});

export const setStatus = state => state.auth.status;
export const setUser = state => state.auth.user;
export const setError = state => state.auth.error;

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;