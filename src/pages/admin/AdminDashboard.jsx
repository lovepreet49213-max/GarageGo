import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../lib/api";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

/* -------------------- COMPONENT -------------------- */

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/admin/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load stats");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const bookingStatusData = stats?.bookingStatusData || [
    { name: "Confirmed", value: 0 },
    { name: "Pending", value: 0 },
    { name: "Cancelled", value: 0 },
  ];
  const monthlyBookings = stats?.monthlyBookings || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of platform activity
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* ---------- STATS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Total Garages" value={stats?.totalGarages ?? 0} />
            <StatCard title="Active Bookings" value={stats?.activeBookings ?? 0} badge="Live" />
            <StatCard title="Registered Users" value={stats?.totalUsers ?? 0} />
          </>
        )}
      </div>

      {/* ---------- CHARTS ---------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Pie */}
        <ChartCard title="Booking Status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {bookingStatusData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-6">
            <Legend color="bg-green-500" label="Confirmed" />
            <Legend color="bg-yellow-500" label="Pending" />
            <Legend color="bg-red-500" label="Cancelled" />
          </div>
        </ChartCard>

        {/* Bar */}
        <ChartCard title="Monthly Bookings">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyBookings}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="bookings"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* -------------------- UI COMPONENTS -------------------- */

function StatCard({ title, value, badge }) {
  return (
    <div className="relative bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      {badge && (
        <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-semibold text-gray-800 mt-2">
        {value}
      </h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-300 rounded w-1/3" />
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      {label}
    </div>
  );
}
