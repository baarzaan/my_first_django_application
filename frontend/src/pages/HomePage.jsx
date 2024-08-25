import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../featuers/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(setUser);

  return (
    <div>
      home page
      {user && (
        <>
          <p>{user.username}</p> <br />
          <p>{user.first_name} {user.last_name}</p> <br />
          <p>{user.email}</p>
          <br />
          <button onClick={() => dispatch(logoutUser())}>Logout</button>
        </>
      )}
    </div>
  );
};

export default HomePage;
