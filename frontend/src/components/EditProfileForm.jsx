import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshToken,
  selectedUser,
  setError,
  setStatus,
  setUser,
  updateUser,
} from "../featuers/authSlice";

const EditProfileForm = ({ setShowEditProfileForm }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectedUser);
  const error = useSelector(setError);
  const status = useSelector(setStatus);
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);

  const handleEditProfile = () => {
    try {
      if (
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        username.trim() !== "" &&
        email.trim() !== ""
      ) {
        const formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("username", username);
        formData.append("email", email);

        if (profilePic) {
          formData.append("profile_pic", profilePic);
        }

        dispatch(updateUser(formData));
        dispatch(refreshToken());
        setShowEditProfileForm(false);
      } else {
        alert("Please fill all inputs!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div
      onClick={() => setShowEditProfileForm(false)}
      className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-screen bg-white/50 backdrop-blur-md flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[350px] p-2 bg-white border border-[#e4e4e5] rounded-md flex flex-col justify-start items-center gap-4"
      >
        <div className="flex flex-col justify-center items-center gap-2">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          {error && <p className="text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col justify-center items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

          <div className="flex justify-center items-center gap-1">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-[150px] border border-[#e4e4e5] rounded-md p-2"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-[150px] border border-[#e4e4e5] rounded-md p-2"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

          <button
            onClick={handleEditProfile}
            disabled={status === "loading"}
            className="w-[300px] p-2 rounded-md bg-blue-600 text-white transform transition-all ease-in-out duration-200 hover:bg-blue-700 active:scale-95"
          >
            {status === "loading" ? "Loading..." : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
