import React from "react";
import { useNavigate } from "react-router-dom";
import { roles, roleStyles, roleIcons } from "../constants"; // pastikan path benar

const HomePage = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-2 text-blue-600">Selamat Datang</h1>
      <p className="text-lg mb-8">Pilih peran untuk masuk ke sistem POS:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl px-6">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleSelectRole(role)}
            className={`${roleStyles[role]} text-white py-4 rounded-xl shadow-md transition-all`}
          >
            {roleIcons[role] || "👤"} Masuk sebagai{" "}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
