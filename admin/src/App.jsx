import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";

export const backendUrl = import.meta.env.VITE_BACKENDURL;
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [isOpen, setIsOpen] = useState(false); // ✅ ADD THIS

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          
          {/* ✅ Sidebar (FIXED) */}
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          {/* Main Area */}
          <div className="flex-1 flex flex-col">
            
            {/* ✅ Navbar (PASS setIsOpen) */}
            <Navbar setToken={setToken} setIsOpen={setIsOpen} />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;