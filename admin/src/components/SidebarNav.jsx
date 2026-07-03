import { NavLink } from "react-router-dom";
import { useState } from "react";
import { assets } from "../assets/assets";

const iconFor = (key) => {
  switch (key) {
    case "overview":
      return assets.logo;
    case "add":
      return assets.add_icon;
    case "list":
      return assets.order_icon;
    case "orders":
      return assets.order_icon;
    case "support":
      return assets.upload_area || assets.order_icon;
    case "support-analytics":
      return assets.parcel_icon || assets.order_icon;
    default:
      return assets.logo;
  }
};

const SidebarNav = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-admin-border bg-admin-surface p-5 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-admin-accent text-sm font-semibold text-admin-accent-contrast">
              A
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-admin-text">Admin</div>
              <div className="text-xs text-admin-muted">Operations</div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-xl text-admin-muted md:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2 overflow-y-auto">
          {items.map((it) => {
            const to = it.to;
            const label = it.label;
            const key = it.key;
            const icon = iconFor(key);

            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-admin-accent text-admin-accent-contrast shadow-sm"
                      : "text-admin-text hover:bg-admin-hover"
                  }`
                }
              >
                <img src={icon} className="h-5 w-5 opacity-90" alt="" />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SidebarNav;

