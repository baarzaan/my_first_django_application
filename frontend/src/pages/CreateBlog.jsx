import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../featuers/authSlice";
import { useNavigate } from "react-router-dom";
import { createBlog, setError, setStatus } from "../featuers/blogSlice";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const user = useSelector(setUser);
  const status = useSelector(setStatus);
  const error = useSelector(setError);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [user, navigate]);

  const handleCreateBlog = () => {
    try {
      if (image && title.trim() !== "" && body.trim() !== "") {
        const formData = new FormData();
        formData.append("author", user.user_id);
        formData.append("title", title);
        formData.append("body", body);
        formData.append("image", image);

        dispatch(createBlog(formData));

        setImage(null);
        setTitle("");
        setBody("");
        return alert("Blog created successfully!");
      } else {
        return alert("Please fill all inputs!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4 justify-start items-center w-[350px] p-2 border border-[#e4e4e5] rounded-md">
        <h2 className="text-2xl font-semibold">Create blog</h2>
        {/* {error && <p>{error}</p>} */}

        <div className="flex flex-col justify-center items-center gap-3">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-[300px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-[300px] p-2 border border-[#e4e4e5] rounded-md"
          />

          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-[300px] p-2 border border-[#e4e4e5] rounded-md resize-none"
          />

          <button
            onClick={handleCreateBlog}
            disabled={status === "loading"}
            className="w-[300px] rounded-md p-2 bg-blue-600 text-white transform transition-all ease-in-out duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Loading..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
