import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../featuers/authSlice";
import { Link } from "react-router-dom";
import { createComment } from "../featuers/blogSlice";

const CommentForm = ({ blogId }) => {
  const dispacth = useDispatch();
  const user = useSelector(setUser);
  const [commentBody, setCommentBody] = useState("");
  const [commentMedia, setCommentMedia] = useState(null);

  const handleCreateComment = () => {
    try {
      const formData = new FormData();
      formData.append("author", user.user_id);
      formData.append("blog", blogId);
      formData.append("body", commentBody);
      formData.append("image", commentMedia);

      dispacth(createComment(formData));

      setCommentBody("");
      setCommentMedia(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex border-b">
      <img
        src={`http://127.0.0.1:8000${user?.profile_pic}`}
        alt=""
        className="w-10 h-10 object-cover rounded-full"
      />

      <div className="flex flex-col justify-start items-start w-full gap-2">
        <Link to={`/@${user?.username}`}>
          <strong>{user?.username}</strong>
        </Link>
        <textarea
          placeholder="Comment"
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          required
          className="w-full p-2 border border-[#e4e4e5] rounded-md"
        />

        {commentMedia && (
          <div className="relative">
            <button
              title="Remove media"
              onClick={() => setCommentMedia(null)}
              className="absolute top-0 left-0"
            >
              X
            </button>

            <img
              src={URL.createObjectURL(commentMedia)}
              alt={commentMedia.name}
            />
          </div>
        )}

        <div className="flex justify-between items-center w-full">
          <label
            htmlFor="comment-media"
            className="border border-[#e4e4e5] rounded-lg p-1 cursor-pointer transform transition-all ease-in-out duration-200 hover:scale-105 active:scale-95"
          >
            Media
          </label>
          <input
            type="file"
            id="comment-media"
            onChange={(e) => setCommentMedia(e.target.files[0])}
            className="hidden"
          />

          <div className="p-1">
            <button
              onClick={handleCreateComment}
              disabled={commentBody.trim() == ""}
              className="rounded-full transform transition-all ease-in-out duration-200 disabled:bg-[#a7a4a4] disabled:cursor-not-allowed disabled:scale-100 py-1 px-3 bg-black text-white hover:scale-105 active:scale-95"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
