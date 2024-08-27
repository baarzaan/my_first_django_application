import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setUser } from "../featuers/authSlice";
import { deleteComment } from "../featuers/blogSlice";

const CommentCard = ({ comment }) => {
  const dispatch = useDispatch();
  const user = useSelector(setUser);
  const [showCommentImage, setShowCommentImage] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const handleClickCommentImage = (selectedComment) => {
    setSelectedComment(selectedComment);
    setShowCommentImage(true);
  };

  return (
    <div className="flex w-full border-b last:border-none pb-2">
      <Link to={`/@${comment.author.username}`}>
        <img
          src={`http://127.0.0.1:8000${comment.author.profile_pic}`}
          className="w-10 h-10 object-cover rounded-full"
          alt=""
        />
      </Link>

      <div className="flex flex-col justify-start items-start gap-2 px-2 w-full">
        <div className="flex justify-between items-center w-full">
          <Link to={`/@${comment.author.username}`}>
            <strong>{comment.author.username}</strong>
          </Link>

          {comment.author.id === user?.user_id && (
            <button onClick={() => dispatch(deleteComment(comment.id))}>
              Delete
            </button>
          )}
        </div>

        <div className="flex flex-col justify-start items-start gap-2">
          <h3 className="text-xl font-bold">{comment.title}</h3>
          <p>{comment.body}</p>

          <img
            onClick={() => handleClickCommentImage(comment)}
            src={`http://127.0.0.1:8000${comment.image}`}
            className="border rounded-md p-1 cursor-pointer"
            alt=""
          />

          {showCommentImage && (
            <div
              onClick={() => setShowCommentImage(false)}
              className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-white/50 backdrop-blur-lg"
            >
              <button
                className="p-4 text-3xl"
                onClick={() => setShowCommentImage(false)}
                title="Close"
              >
                X
              </button>
              <div
                className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={`http://127.0.0.1:8000${comment.image}`} alt="" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
