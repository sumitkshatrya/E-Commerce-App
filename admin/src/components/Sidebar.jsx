import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-5 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">

          <NavLink
            to="/add"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <img
              src={assets.add_icon}
              className="w-5 h-5"
              alt=""
            />
            Add Product
          </NavLink>

          <NavLink
            to="/list"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <img
              src={assets.order_icon}
              className="w-5 h-5"
              alt=""
            />
            Product List
          </NavLink>

          <NavLink
            to="/orders"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <img
              src={assets.order_icon}
              className="w-5 h-5"
              alt=""
            />
            Orders
          </NavLink>

        </div>
      </div>
    </>
  );
};

export default Sidebar;