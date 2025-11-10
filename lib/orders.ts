export type OrderStatus = "pending" | "approved" | "rejected" | "in-progress" | "completed";

export interface Order {
  id: string;
  patientName: string;
  roomNumber: string;
  bed?: string;
  mealTime: string;
  menuItems: string[];
  specialInstructions?: string;
  status: OrderStatus;
  createdAt: number;
}

const STORAGE_KEY = "rhv_orders";

function readStorage(): Order[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch (e) {
    console.error("readStorage error", e);
    return [];
  }
}

function writeStorage(orders: Order[]) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("writeStorage error", e);
  }
}

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getOrders(): Order[] {
  return readStorage();
}

export function addOrder(data: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }): Order {
  const orders = readStorage();
  const newOrder: Order = {
    id: genId(),
    createdAt: Date.now(),
    status: data.status ?? "pending",
    patientName: data.patientName,
    roomNumber: data.roomNumber,
    bed: data.bed,
    mealTime: data.mealTime,
    menuItems: data.menuItems,
    specialInstructions: data.specialInstructions ?? "",
  };
  // newest first
  const updated = [newOrder, ...orders];
  writeStorage(updated);
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readStorage();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status };
  writeStorage(orders);
  return orders[idx];
}

export function clearOrders() {
  writeStorage([]);
}
