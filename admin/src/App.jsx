import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export const backendUrl = import.meta.env.VITE_BACKENDURL;
export const currency = "$";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Support from "./pages/Support";
import SupportAnalytics from "./pages/SupportAnalytics";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";



const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [adminTheme, setAdminTheme] = useState(
    localStorage.getItem("adminTheme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("adminTheme", adminTheme);
    document.documentElement.dataset.adminTheme = adminTheme;
  }, [adminTheme]);

  return (
    <div className="bg-admin-bg min-h-screen">
      <ToastContainer />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          <div className="flex-1 flex flex-col">
            <Navbar
              setToken={setToken}
              setIsOpen={setIsOpen}
              adminTheme={adminTheme}
              setAdminTheme={setAdminTheme}
            />

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="/support" element={<Support token={token} />} />
                  <Route
                    path="/support-analytics"
                    element={<SupportAnalytics token={token} />}
                  />
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

