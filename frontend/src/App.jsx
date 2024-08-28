import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { routes } from "./routes/Routes";
import Header from "./components/Header";
import { useDispatch } from "react-redux";
import { getBlogs, getComments } from "./featuers/blogSlice";
import { getUsers, refreshToken } from "./featuers/authSlice";
import { jwtDecode } from "jwt-decode";


function App() {
  const dispatch = useDispatch();

  const scheduleTokenRefresh = () => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const expirationTime = decodedToken.exp * 1000; // `exp` is in seconds, so convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration > 0) {
        // Refresh the token a little before it expires (e.g., 30 seconds before)
        const refreshTime = timeUntilExpiration - 30000;

        setTimeout(() => {
          dispatch(refreshToken()).then((action) => {
            if (refreshToken.fulfilled.match(action)) {
              // Token was successfully refreshed
              // Reschedule another refresh
              scheduleTokenRefresh();
            } else {
              // Handle token refresh failure (e.g., log out the user)
              console.error('Token refresh failed, logging out the user.');
              dispatch(logoutUser());
            }
          });
        }, refreshTime);
      }
    }
  };

  useEffect(() => {
    dispatch(getBlogs());
    dispatch(getComments());
    dispatch(getUsers());
    scheduleTokenRefresh();
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
