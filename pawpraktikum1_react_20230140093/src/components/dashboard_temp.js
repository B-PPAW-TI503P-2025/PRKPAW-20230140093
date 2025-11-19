import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setName(decoded.name || "Pengguna");
    } catch {
      setName("Pengguna");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-blue-200 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center">

        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Dashboard
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Selamat datang, <span className="font-semibold">{name}</span> 🎉
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default DashboardPage;
