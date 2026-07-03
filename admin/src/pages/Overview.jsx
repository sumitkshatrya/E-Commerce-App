import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../constants/adminConstants";

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
    <div className="text-xs uppercase tracking-[0.2em] text-admin-muted">{label}</div>
    <div className="mt-3 text-3xl font-bold text-admin-text">{value}</div>
  </div>
);

const Overview = ({ token }) => {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    if (!token) return;
    setErr("");
    try {
      // No backend contract specified for overview; keep it resilient.
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (response.data?.success) {
        const orders = response.data.orders || [];
        const recent = [...orders].slice(0, 6);
        setData({
          kpis: {
            openOrders: orders.filter((o) => o.status && o.status !== "Delivered").length,
            recentOrders: recent.length,
            revenue: recent.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
            supportTickets: 0,
          },
          recent,
        });
      } else {
        setErr(response.data?.message || "Failed to load overview");
        toast.error(response.data?.message || "Failed to load overview");
      }
    } catch (e) {
      setErr(e.message || "Failed to load overview");
      toast.error(e.message || "Failed to load overview");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!data && !err) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-admin-text">Overview</h1>
        <div className="mt-6 text-sm text-admin-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Overview</h1>
          <p className="text-sm text-admin-muted mt-1">Today’s operational snapshot</p>
        </div>
        <button onClick={load} className="px-4 py-2 rounded-xl bg-admin-accent text-admin-accent-contrast text-sm font-medium hover:opacity-90 transition">
          Refresh
        </button>
      </div>

      {err ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Orders" value={data?.kpis?.openOrders ?? 0} />
        <StatCard label="Recent Orders" value={data?.kpis?.recentOrders ?? 0} />
        <StatCard label="Revenue (Recent)" value={`${currency} ${data?.kpis?.revenue ?? 0}`} />
        <StatCard label="Support Tickets" value={data?.kpis?.supportTickets ?? 0} />
      </div>

      <div className="mt-8 rounded-2xl border border-admin-border bg-admin-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-admin-border">
          <div className="text-sm font-semibold text-admin-text">Recent activity</div>
          <div className="text-xs text-admin-muted mt-1">Latest order updates</div>
        </div>

        <div className="divide-y divide-admin-border">
          {(data?.recent ?? []).length === 0 ? (
            <div className="p-5 text-sm text-admin-muted">No recent orders.</div>
          ) : (
            (data.recent || []).map((o, idx) => (
              <div key={o._id || idx} className="p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-admin-text">{o.address?.firstName} {o.address?.lastName}</div>
                  <div className="text-xs text-admin-muted mt-1">Order: {o._id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-admin-text">{currency} {o.amount}</div>
                  <div className="text-xs text-admin-muted mt-1">{new Date(o.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;

