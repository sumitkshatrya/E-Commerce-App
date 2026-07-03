import { assets } from "../assets/assets";

const Topbar = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-admin-border bg-admin-surface/95 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-admin-border bg-admin-surface-muted text-sm font-semibold text-admin-text md:hidden"
            aria-label="Open navigation"
            onClick={() => window.dispatchEvent(new Event("toggle-admin-sidebar"))}
          >
            ☰
          </button>
          <img src={assets.logo} alt="" className="h-9 w-auto md:hidden" />
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-admin-text">Operations Dashboard</div>
            <div className="text-xs text-admin-muted">Linear + Stripe control center</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-admin-border bg-admin-surface-muted px-3 py-2 text-xs font-medium text-admin-muted sm:block">
            Production
          </div>
          <button
            onClick={onLogout}
            className="rounded-2xl bg-admin-accent px-4 py-2 text-sm font-medium text-admin-accent-contrast transition hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

