import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getComments, setBlogs, setComments } from "../featuers/blogSlice";
import { setUser } from "../featuers/authSlice";
import BlogCard from "../components/BlogCard";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";

const BlogPage = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(setBlogs);
  const user = useSelector(setUser);
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const comments = useSelector(setComments);
  const [blogComments, setBlogComments] = useState([]);

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, [user, navigate]);

  const getBlog = () => {
    const foundBlog = blogs.find((blog) => blog.id === blogId);
    // console.log(foundBlog);
    setBlog(foundBlog);
  };

  useEffect(() => {
    getBlog();
  }, [blogs, blogId]);

  return (
    <>
      {blog ? (
        <div className="container mx-auto max-w-[600px] p-4 flex flex-col gap-3">
          <BlogCard blog={blog} />

          {/* Comment Form */}
          <CommentForm blogId={blog.id} />

          {comments
            .filter((comment) => comment.blog === blog.id)
            .map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
        </div>
      ) : (
        <>404</>
      )}
    </>
  );
};

export default BlogPage;
