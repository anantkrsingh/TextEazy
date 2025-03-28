import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import apiHelper from "./utils/api";

function MyRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const getUser = async () => {
    try {
      const res = await apiHelper.get(`/auth/user`, {
        withCredentials: true,
      });

      if (res?.user) {
        console.log("User authenticated:", res.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to={"/dashboard/home"} replace /> : <Login />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default MyRoutes;
