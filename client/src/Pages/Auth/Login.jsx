import React, { useEffect } from "react";
import apiHelper, { baseURL } from "../../utils/api";
import { CircularProgress } from "@mui/material";

function Login() {
  const [loading, setLoading] = React.useState(true);
  const getUser = async () => {
    try {
      const res = await apiHelper.get(`/auth/user`, {
        withCredentials: true,
      });

      if (res?.user) {
        window.location.href = "/dashboard/home";
      } else {
      }
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const handleLogin = () => {
    window.open(`${baseURL}/auth/google`, "_self");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <>
          <p className="mb-4 text-lg text-gray-800">Login to continue</p>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login with Google
          </button>
        </>
      </div>
    </div>
  );
}

export default Login;
