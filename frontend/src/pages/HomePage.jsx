import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../featuers/authSlice";
import { setBlogs } from "../featuers/blogSlice";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(setUser);
  const blogs = useSelector(setBlogs);

  return (
    <div className="container mx-auto max-w-[600px] p-4">
      <div className="flex flex-col justify-center items-center w-full gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
