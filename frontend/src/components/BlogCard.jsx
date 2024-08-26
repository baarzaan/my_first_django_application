import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLikes, setLikes, toggleLike } from "../featuers/blogSlice";
import { setUser } from "../featuers/authSlice";

const BlogCard = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector(setUser);
  const [showBlogImage, setShowBlogImage] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  // const [isLiked, setIsLiked] = useState(false);
  const likes = useSelector(setLikes);
  const isLiked = likes.some(
    (like) => like.blog === blog.id && like.user === user.user_id
  );

  useEffect(() => {
    dispatch(getLikes());
  }, [dispatch]);

  useEffect(() => {}, [likes, blog.id, user.user_id]);

  const handleClickBlogImage = (selectedBlog) => {
    setSelectedBlog(selectedBlog);
    setShowBlogImage(true);
  };

  const handleLikeClick = () => {
    dispatch(toggleLike({ blogId: blog.id, userId: user?.user_id, isLiked }));
    // console.log({ blog: blog.id, user: user.user_id });
  };

  return (
    <div className="flex w-full border-b pb-2">
      <Link to={`/@${blog.author.username}`}>
        <img
          src={`http://127.0.0.1:8000${blog.author.profile_pic}`}
          className="w-10 h-10 object-cover rounded-full"
          alt=""
        />
      </Link>

      <div className="flex flex-col justify-start items-start gap-2 px-2 w-full">
        <div className="flex justify-between items-center w-full">
          <Link to={`/@${blog.author.username}`}>
            <strong>{blog.author.username}</strong>
          </Link>

          <div className="flex justify-center items-center gap-2">
            <button>More</button>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start gap-2">
          <Link to={`/blog/${blog.id}`}>
            <h3 className="text-xl font-bold">{blog.title}</h3>
            <p>{blog.body}</p>
          </Link>

          <img
            onClick={() => handleClickBlogImage(blog)}
            src={`http://127.0.0.1:8000${blog.image}`}
            className="border rounded-md p-1 cursor-pointer"
            alt=""
          />

          {showBlogImage && (
            <div className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-white/50 backdrop-blur-lg">
              <button
                className="p-4 text-3xl"
                onClick={() => setShowBlogImage(false)}
                title="Close"
              >
                X
              </button>
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                <img src={`http://127.0.0.1:8000${blog.image}`} alt="" />
              </div>
            </div>
          )}

          <p>{likes.filter((like) => like.blog === blog.id).length} likes</p>
          <button onClick={handleLikeClick}>
            {likes.find(
              (like) => like.blog === blog.id && like.user.id === user.user_id
            )
              ? "Unlike"
              : "Like"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
