import { assets } from "../assets/assets";

const Navbar = ({ setToken, setIsOpen, adminTheme, setAdminTheme }) => {
  const isDark = adminTheme === "dark";

  return (
    <div className="w-full bg-admin-surface border-b border-admin-border px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-2xl text-admin-text"
          aria-label="Open navigation"
        >
          ☰
        </button>

        <img src={assets.logo} className="h-12 w-auto" />
        <h1 className="hidden sm:block font-semibold text-admin-text">
          Admin Panel
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAdminTheme(isDark ? "light" : "dark")}
          className="px-4 py-2 text-sm rounded-lg border border-admin-border bg-admin-surface-muted text-admin-text hover:bg-admin-hover transition"
        >
          {isDark ? "Light mode" : "Dark mode"}
        </button>

        <button
          onClick={() => setToken("")}
          className="px-4 py-2 text-sm bg-admin-accent text-admin-accent-contrast rounded-lg hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};


export default Navbar;