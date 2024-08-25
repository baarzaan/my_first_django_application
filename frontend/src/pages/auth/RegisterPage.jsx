import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  setError,
  setStatus,
  setUser,
} from "../../featuers/authSlice";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const status = useSelector(setStatus);
  const user = useSelector(setUser);
  const error = useSelector(setError);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user, navigate]);

  const handleRegisterUser = () => {
    try {
      if (
        profilePic &&
        firstName.trim() != "" &&
        lastName.trim() != "" &&
        username.trim() != "" &&
        email.trim() != "" &&
        password.trim() != ""
      ) {
        const formData = new FormData();

        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("profile_pic", profilePic);
        formData.append("password", password);

        dispatch(registerUser(formData));
      } else {
        return alert("Please fill all inputs!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-start items-center w-[350px] p-2 rounded-md border border-[#e4e4e5] gap-4">
        <h2 className="text-xl font-bold">Register</h2>
        {/* {error && <p className="text-red-500">{error}</p>} */}

        <div className="flex flex-col justify-center items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

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

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[300px] border border-[#e4e4e5] rounded-md p-2"
          />

          <button
            onClick={handleRegisterUser}
            className="bg-blue-600 text-white transform transition-all ease-in-out duration-200 hover:bg-blue-700 active:scale-95 w-[300px] p-2 rounded-md"
          >
            Register
          </button>

          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 transform transition-all ease-in-out duration-200 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
