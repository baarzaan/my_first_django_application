import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode'

const initialState = {
    status: "idle",
    user: localStorage.getItem("access_token") ? jwtDecode(localStorage.getItem("access_token")) : null,
    users: [],
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

export const updateUser = createAsyncThunk("auth/updateUser", async (userData, { rejectWithValue }) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/users/update-user/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: userData,
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return rejectWithValue("Error!, check your internet!");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const getUsers = createAsyncThunk("auth/getUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/', {
            method: "GET",
        });
        const data = await response.json();

        if (response.ok) {
            // console.info(data);
            return data;
        } else {
            return rejectWithValue("Error!, check your internet!");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await fetch('http://127.0.0.1:8000/api/users/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }) // Ensure the key is correct based on your API
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            if (data.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }

            return data;
        } else {
            return rejectWithValue("Error refreshing token, please check your internet connection!");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            state.user = null;
        },

        setUser: (state, action) => {
            state.user = action.payload;
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

        builder.addCase(updateUser.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.status = 'success';
            state.user = action.payload;
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.status = 'loading';
            state.error = action.payload;
        });

        builder.addCase(getUsers.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.status = 'success';
            state.users = action.payload;
        });
        builder.addCase(getUsers.rejected, (state, action) => {
            state.status = 'loading';
            state.error = action.payload;
        });

        builder.addCase(refreshToken.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.status = 'success';
        });
        builder.addCase(refreshToken.rejected, (state, action) => {
            state.status = 'loading';
            state.error = action.payload;
        });
    }
});

export const setStatus = state => state.auth.status;
export const selectedUser = state => state.auth.user;
export const setUsers = state => state.auth.users;
export const setError = state => state.auth.error;

export const { logoutUser, setUser } = authSlice.actions;

export default authSlice.reducer;