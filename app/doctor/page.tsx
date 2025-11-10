"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  AlertCircle,
  CheckCircle,
  XCircle,
  Utensils,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { getOrders, Order, updateOrderStatus } from "../../lib/orders";
import { toast } from "react-toastify";

type FilterTab = "pending" | "reviewed" | "all";

export default function DoctorPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  const stats = orders.reduce(
    (acc, o) => {
      acc.total += 1;
      if (o.status === "pending") acc.pending += 1;
      if (o.status === "approved") acc.approved += 1;
      if (o.status === "rejected") acc.rejected += 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, total: 0 }
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0fbff] to-[#f7fff4] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#0f172a]">
                Doctor Dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Review and approve patient meal orders
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition whitespace-nowrap"
          >
            Change Role
          </Link>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Pending Review"
            value={stats.pending}
            icon={<AlertCircle size={28} />}
            iconBg="bg-orange-100"
            iconColor="text-orange-500"
          />
          <StatCard
            label="Approved"
            value={stats.approved}
            icon={<CheckCircle size={28} />}
            iconBg="bg-green-100"
            iconColor="text-green-500"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<XCircle size={28} />}
            iconBg="bg-red-100"
            iconColor="text-red-500"
          />
          <StatCard
            label="Total Orders"
            value={stats.total}
            icon={<Utensils size={28} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            label={`Pending Review (${stats.pending})`}
          />
          <TabButton
            active={activeTab === "reviewed"}
            onClick={() => setActiveTab("reviewed")}
            label={`Reviewed (${stats.approved + stats.rejected})`}
          />
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label={`All (${stats.total})`}
          />
        </div>

        {/* Orders List */}
        <div className="bg-white/80 rounded-lg shadow-sm border border-white/40 p-6">
          {orders.length === 0 && (
            <p className="text-slate-600 text-center py-8">
              No orders in this category yet.
            </p>
          )}

          {orders.length > 0 && (
            <div className="space-y-4">
              {orders
                .filter((o) => {
                  if (activeTab === "pending") return o.status === "pending";
                  if (activeTab === "reviewed") return o.status !== "pending";
                  return true;
                })
                .map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    onUpdate={(newStatus) => {
                      updateOrderStatus(o.id, newStatus);
                      // re-read orders
                      setOrders(getOrders());
                      
                      // Show toast notification
                      if (newStatus === "approved") {
                        toast.success(`Order #${o.id.slice(0, 6).toUpperCase()} has been approved`);
                      } else {
                        toast.error(`Order #${o.id.slice(0, 6).toUpperCase()} has been rejected`);
                      }
                    }}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (status: "approved" | "rejected") => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "text-orange-600 bg-orange-50",
    approved: "text-green-600 bg-green-50",
    rejected: "text-red-600 bg-red-50",
    "in-progress": "text-blue-600 bg-blue-50",
    completed: "text-green-600 bg-green-50",
  };

  const mealTimings: Record<string, string> = {
    breakfast: "7:00 AM - 9:00 AM",
    lunch: "12:00 PM - 2:00 PM",
    dinner: "6:00 PM - 8:00 PM",
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Header with Order # and Status */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0f172a]">
            Order #{order.id.slice(0, 6).toUpperCase()}
          </h3>
          <p className="text-sm text-slate-500">
            Submitted: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-md text-xs font-semibold uppercase ${
            statusColors[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Patient</p>
              <p className="font-medium text-[#0f172a]">{order.patientName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Location</p>
              <p className="font-medium text-[#0f172a]">
                Room {order.roomNumber}
                {order.bed ? `, Bed ${order.bed}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Meal Type</p>
              <p className="font-medium text-[#0f172a] capitalize">
                {order.mealTime}
              </p>
              <p className="text-sm text-slate-500">
                {mealTimings[order.mealTime.toLowerCase()] || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Ordered Items</p>
          <ul className="space-y-1">
            {order.menuItems.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[#0f172a]">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="mb-6 p-3 bg-slate-50 rounded-md">
          <p className="text-xs text-slate-500 mb-1">Special Instructions</p>
          <p className="text-sm text-slate-700">{order.specialInstructions}</p>
        </div>
      )}

      {/* Action Buttons */}
      {order.status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate("approved")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
          >
            <CheckCircle size={18} />
            Approve Order
          </button>
          <button
            onClick={() => onUpdate("rejected")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 font-medium border border-red-200 rounded-lg transition"
          >
            <XCircle size={18} />
            Reject Order
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white/80 rounded-lg shadow-sm border border-white/40 p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600 mb-1">{label}</p>
        <p className="text-3xl font-semibold text-[#0f172a]">{value}</p>
      </div>
      <div className={`${iconBg} ${iconColor} p-3 rounded-full`}>{icon}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
        active
          ? "bg-blue-500 text-white shadow-sm"
          : "bg-white/60 text-slate-700 hover:bg-white/80 border border-white/40"
      }`}
    >
      {label}
    </button>
  );
}
