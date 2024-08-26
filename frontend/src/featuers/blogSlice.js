import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: 'idle',
    blogs: [],
    likes: [],
    comments: [],
    error: null,
};

export const getBlogs = createAsyncThunk("blog/getBlogs", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/blogs/', {
            method: 'GET',
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return rejectWithValue("Error, check your internet");
        }
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const createBlog = createAsyncThunk("blog/createBlog", async (blogData, { rejectWithValue }) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/blogs/create-blog/', {
            method: 'POST',
            body: blogData,
        });
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            const errorText = await response.text(); // Read response as text
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        // Attempt to parse the response as JSON
        const data = await response.json();

        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const getLikes = createAsyncThunk("blog/getLikes", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/likes/", {
            method: 'GET',
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return rejectWithValue("Error, check your internet");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const toggleLike = createAsyncThunk(
    "blog/toggleLike",
    async ({ blogId, userId, isLiked }, { rejectWithValue }) => {
        const accessToken = localStorage.getItem('access_token');
        const url = `http://127.0.0.1:8000/api/blogs/blog/${blogId}/like`;

        try {
            const method = isLiked ? 'DELETE' : 'POST';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: isLiked ? null : JSON.stringify({ user: userId, blog: blogId })
            });
            console.log({ user: userId, blog: blogId });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'An error occurred');
            }

            const data = await response.json();
            console.info(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getBlogs.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getBlogs.fulfilled, (state, action) => {
            state.status = 'idle';
            state.blogs = action.payload;
        });
        builder.addCase(getBlogs.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.payload;
        });

        builder.addCase(createBlog.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(createBlog.fulfilled, (state, action) => {
            state.status = 'idle';
            state.blogs = action.payload;
        });
        builder.addCase(createBlog.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.payload;
        });

        builder.addCase(getLikes.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getLikes.fulfilled, (state, action) => {
            state.status = 'idle';
            state.likes = action.payload;
        });
        builder.addCase(getLikes.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.payload;
        });

        builder.addCase(toggleLike.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(toggleLike.fulfilled, (state, action) => {
            state.status = 'idle';
            state.likes = action.payload;
        });
        builder.addCase(toggleLike.rejected, (state, action) => {
            state.status = 'fail';
            state.error = action.payload;
        });
    }
});

export const setStatus = state => state.blog.status;
export const setBlogs = state => state.blog.blogs;
export const setError = state => state.blog.error;
export const setLikes = state => state.blog.likes;

export default blogSlice.reducer;