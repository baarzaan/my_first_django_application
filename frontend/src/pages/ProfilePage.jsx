import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { logoutUser, selectedUser, setUsers } from "../featuers/authSlice";
import { setBlogs } from "../featuers/blogSlice";
import BlogCard from "../components/BlogCard";
import EditProfileForm from "../components/EditProfileForm";

const ProfilePage = () => {
  const dispacth = useDispatch();
  const { username } = useParams();
  const users = useSelector(setUsers);
  const user = useSelector(selectedUser);
  const [userProfile, setUserProfile] = useState(null);
  const blogs = useSelector(setBlogs);
  const userBlogs = blogs.filter(
    (blog) => blog.author.username === userProfile?.username
  );
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);

  const getUser = () => {
    const foundUserProfile = users.find((user) => user.username === username);
    // console.log(foundUserProfile);
    setUserProfile(foundUserProfile);
  };

  useEffect(() => {
    getUser();
  }, [users, username]);

  return (
    <>
      {userProfile ? (
        <div className="flex flex-col p-4 gap-4">
          <div className="flex flex-col justify-center items-center gap-3 w-full shadow-md p-2 rounded-md">
            <div className="flex flex-col justify-center items-center gap-2">
              <img
                src={`http://127.0.0.1:8000${userProfile.profile_pic}`}
                className="w-12 h-12 rounded-full object-cover"
                alt="Profile picture"
              />
              <h2>
                {userProfile.first_name} {userProfile.last_name}
              </h2>
              <p>@{userProfile.username}</p>
              <p>{userProfile.email}</p>
            </div>

            {userProfile.username === user?.username && (
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <button
                  onClick={() => setShowEditProfileForm(true)}
                  className="border border-blue-600 text-blue-600 rounded-md py-1 px-3 transform transition-all ease-in-out duration-200 hover:bg-blue-600 hover:text-white active:scale-95"
                >
                  Edit profile
                </button>

                {showEditProfileForm && (
                  <EditProfileForm
                    setShowEditProfileForm={setShowEditProfileForm}
                  />
                )}

                <button
                  onClick={() => {
                    dispacth(logoutUser());
                    window.location.pathname = "/";
                    window.location.reload();
                  }}
                  className="border border-red-600 text-red-600 rounded-md py-1 px-3 transform transition-all ease-in-out duration-200 hover:bg-red-600 hover:text-white active:scale-95"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <strong className="text-xl">My blogs ({userBlogs.length})</strong>

            <div className="container mx-auto max-w-[600px] flex flex-col justify-center items-center gap-3">
              {userBlogs.map((userBlog) => (
                <BlogCard key={userBlog.id} blog={userBlog} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>404</>
      )}
    </>
  );
};

export default ProfilePage;
