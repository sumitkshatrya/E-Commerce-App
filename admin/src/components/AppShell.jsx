import { useMemo } from "react";
import SidebarNav from "./SidebarNav";
import Topbar from "./Topbar";

const AppShell = ({ children, sidebarItems, onLogout }) => {
  const shell = useMemo(() => ({
    sidebarItems: sidebarItems || [],
  }), [sidebarItems]);

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text">
      <div className="md:flex md:min-h-screen">
        <SidebarNav items={shell.sidebarItems} />
        <div className="flex min-h-screen flex-1 flex-col md:ml-0">
          <Topbar onLogout={onLogout} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

