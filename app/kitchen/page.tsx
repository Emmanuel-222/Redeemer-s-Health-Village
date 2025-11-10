"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat, Bell, CheckCircle, Utensils, User, MapPin, Clock, PlayCircle } from "lucide-react";
import { getOrders, Order, updateOrderStatus } from "../../lib/orders";
import { toast } from "react-toastify";

type FilterTab = "new" | "inProgress" | "completed" | "all";

export default function KitchenPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("new");
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  // Filter for approved orders only (new orders for kitchen)
  // and orders that are in-progress or completed
  const kitchenOrders = orders.filter(
    (o) => o.status === "approved" || o.status === "in-progress" || o.status === "completed"
  );

  const stats = kitchenOrders.reduce(
    (acc, o) => {
      if (o.status === "approved") acc.newOrders += 1;
      if (o.status === "in-progress") acc.inProgress += 1;
      if (o.status === "completed") acc.completedToday += 1;
      acc.totalApproved += 1;
      return acc;
    },
    { newOrders: 0, inProgress: 0, completedToday: 0, totalApproved: 0 }
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0fbff] to-[#f7fff4] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#0f172a]">
                Kitchen Dashboard
              </h1>
              <p className="text-sm text-green-600 font-medium">
                Prepare approved meal orders
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
            label="New Orders"
            value={stats.newOrders}
            icon={<Bell size={28} />}
            iconBg="bg-orange-100"
            iconColor="text-orange-500"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<ChefHat size={28} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-500"
          />
          <StatCard
            label="Completed Today"
            value={stats.completedToday}
            icon={<CheckCircle size={28} />}
            iconBg="bg-green-100"
            iconColor="text-green-500"
          />
          <StatCard
            label="Total Approved"
            value={stats.totalApproved}
            icon={<Utensils size={28} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <TabButton
            active={activeTab === "new"}
            onClick={() => setActiveTab("new")}
            label={`New Orders (${stats.newOrders})`}
            variant="green"
          />
          <TabButton
            active={activeTab === "inProgress"}
            onClick={() => setActiveTab("inProgress")}
            label={`In Progress (${stats.inProgress})`}
          />
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            label={`Completed (${stats.completedToday})`}
          />
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label={`All (${stats.totalApproved})`}
          />
        </div>

        {/* Orders List */}
        <div className="bg-white/80 rounded-lg shadow-sm border border-white/40 p-6">
          {kitchenOrders.length === 0 && (
            <p className="text-slate-600 text-center py-8">
              No orders in this category yet.
            </p>
          )}

          {kitchenOrders.length > 0 && (
            <div className="space-y-4">
              {kitchenOrders
                .filter((o) => {
                  if (activeTab === "new") return o.status === "approved";
                  if (activeTab === "inProgress") return o.status === "in-progress";
                  if (activeTab === "completed") return o.status === "completed";
                  return true;
                })
                .map((o) => (
                  <KitchenOrderCard
                    key={o.id}
                    order={o}
                    onUpdate={(newStatus) => {
                      updateOrderStatus(o.id, newStatus);
                      setOrders(getOrders());
                      
                      // Show toast notification
                      if (newStatus === "in-progress") {
                        toast.info(`Order #${o.id.slice(0, 6).toUpperCase()} is now in progress`);
                      } else if (newStatus === "completed") {
                        toast.success(`Order #${o.id.slice(0, 6).toUpperCase()} has been completed!`);
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

function KitchenOrderCard({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (status: "in-progress" | "completed") => void;
}) {
  const statusColors = {
    approved: "text-orange-600 bg-orange-50",
    "in-progress": "text-blue-600 bg-blue-50",
    completed: "text-green-600 bg-green-50",
  };

  const mealTimings: Record<string, string> = {
    breakfast: "7:00 AM - 9:00 AM",
    lunch: "12:00 PM - 2:00 PM",
    dinner: "6:00 PM - 8:00 PM",
  };

  const displayStatus = order.status === "approved" ? "new" : order.status;

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
            statusColors[order.status as keyof typeof statusColors] || "text-slate-600 bg-slate-50"
          }`}
        >
          {displayStatus}
        </span>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Patient</p>
              <p className="font-medium text-[#0f172a]">{order.patientName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Location</p>
              <p className="font-medium text-[#0f172a]">
                Room {order.roomNumber}
                {order.bed ? `, Bed ${order.bed}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-green-600 mt-0.5" />
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
        <div className="mb-6 p-3 bg-amber-50 rounded-md border border-amber-200">
          <p className="text-xs text-amber-700 font-semibold mb-1">Special Instructions</p>
          <p className="text-sm text-amber-900">{order.specialInstructions}</p>
        </div>
      )}

      {/* Action Buttons */}
      {order.status === "approved" && (
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate("in-progress")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            <PlayCircle size={18} />
            Start Preparing
          </button>
        </div>
      )}

      {order.status === "in-progress" && (
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate("completed")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
          >
            <CheckCircle size={18} />
            Mark as Completed
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
      <div className={`${iconBg} ${iconColor} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  variant?: "default" | "green";
}) {
  const activeClass = variant === "green" 
    ? "bg-green-500 text-white shadow-sm"
    : "bg-blue-500 text-white shadow-sm";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
        active
          ? activeClass
          : "bg-white/60 text-slate-700 hover:bg-white/80 border border-white/40"
      }`}
    >
      {label}
    </button>
  );
}
