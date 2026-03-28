import { assets } from "../assets/assets";

const Navbar = ({ setToken, setIsOpen }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <img src={assets.logo} className="h-12 w-auto" />
        <h1 className="hidden sm:block font-semibold text-gray-800">
          Admin Panel
        </h1>
      </div>

      <button
        onClick={() => setToken("")}
        className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;