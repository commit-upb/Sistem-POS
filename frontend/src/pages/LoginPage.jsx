import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roles } from "../constants";

const LoginPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  // cek apakah role valid
  if (!roles.includes(role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-red-500">
          Role "{role}" tidak valid!
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    );
  }

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login {role.charAt(0).toUpperCase() + role.slice(1)}
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
