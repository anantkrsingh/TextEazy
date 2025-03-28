import React from "react";
import { baseURL } from "../../utils/api";

function Login() {
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
