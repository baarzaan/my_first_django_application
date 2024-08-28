import React from "react";
import { useSelector } from "react-redux";
import { selectedUser } from "../featuers/authSlice";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const user = useSelector(selectedUser);
  const location = useLocation();

  if (
    location.pathname.includes("/login") ||
    location.pathname.includes("/register")
  ) {
    return null;
  }

  return (
    <header className="w-full h-14 bg-white/50 backdrop-blur-md shadow-sm flex justify-between items-center px-2">
      <div>
        <Link to="/" className="text-2xl">
          LOGO
        </Link>
      </div>

      <nav>
        <ul className="flex justify-center items-center gap-10">
          <li className="transform transition-all ease-in-out duration-200 hover:text-[#969393]">
            <Link to="/">Home</Link>
          </li>

          {user && (
            <li className="transform transition-all ease-in-out duration-200 hover:text-[#969393]">
              <Link to="/create">Create</Link>
            </li>
          )}
        </ul>
      </nav>

      <div>
        {user ? (
          <Link to={`/profile/${user.username}`}>
            <img
              src={`http://127.0.0.1:8000${user.profile_pic}`}
              alt="User profile picture"
              className="w-12 h-12 object-cover rounded-full"
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="py-1 px-3 border border-blue-600 text-blue-600 transform transition-all ease-in-out duration-200 hover:text-white hover:bg-blue-600 active:scale-95"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
