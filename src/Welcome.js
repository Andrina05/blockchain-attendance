import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Blockchain-based Attendance System</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/register-admin")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register as Admin
        </button>
        <a href="/login">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Login
        </button>
        </a>
      </div>
    </div>
  );
};

export default Welcome;