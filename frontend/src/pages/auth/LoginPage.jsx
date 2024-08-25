import React, { useEffect, useState } from "react";
import {
  loginUser,
  setError,
  setStatus,
  setUser,
} from "../../featuers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const status = useSelector(setStatus);
  const user = useSelector(setUser);
  const error = useSelector(setError);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user, navigate]);

  const handleLoginUser = () => {
    try {
      if (email.trim() != "" && password.trim() != "") {
        const userData = { email, password };
        dispatch(loginUser(userData));
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
        <h2 className="text-xl font-bold">Login</h2>
        {/* {error && <p className="text-red-500">{error}</p>} */}

        <div className="flex flex-col justify-center items-center gap-3">
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
            onClick={handleLoginUser}
            className="bg-blue-600 text-white transform transition-all ease-in-out duration-200 hover:bg-blue-700 active:scale-95 w-[300px] p-2 rounded-md"
          >
            Login
          </button>

          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 transform transition-all ease-in-out duration-200 hover:text-blue-700"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
