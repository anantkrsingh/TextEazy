import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import apiHelper, { baseURL } from "../../utils/api";
import Home from "./Home/Home";
import Editor from "./Editor/Editor";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiHelper.get(`/auth/user`, {
          withCredentials: true,
        });

        if (res?.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    window.open(`${baseURL}/auth/logout`, "_self");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300 px-10">
      <div className="text-lg font-bold text-black">Text Eazy</div>
      <div className="flex items-center relative">
        <Link
          to="/dashboard/home"
          className="mr-4 text-blue-500 hover:underline"
        >
          Home
        </Link>

        {user && (
          <div className="relative group">
            <a href="#" className="w-4 h-4 rounded-full overflow-hidden">
              <img
                src={user.photo}
                alt="Avatar"
                className="w-10 h-10  object-cover rounded-full"
              />
            </a>
            <div className="absolute z-50 right-0  w-48 bg-white border border-gray-300 rounded shadow-lg hidden group-hover:block">
              <div className="px-4 py-2 text-gray-700">{user.name}</div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="p-5">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/editor/:docId" element={<Editor />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
