import api from "./api";

export async function placeOrder(payload) {
  const { data } = await api.post("/orders", payload);
  return data;
}

export async function getMyOrders(studentId) {
  if (!studentId) {
    throw new Error("Student ID is required to fetch student orders");
  }

  const { data } = await api.get(`/orders/student/${studentId}`);
  return Array.isArray(data) ? data : data?.orders || [];
}

export async function cancelOrder(orderId, studentId) {
  const { data } = await api.put(`/orders/${orderId}/cancel`, { studentId });
  return data;
}

export async function getAllOrders() {
  const { data } = await api.get("/orders");
  return Array.isArray(data) ? data : data?.orders || [];
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
}

export async function getAdminAnalytics() {
  const { data } = await api.get("/orders/analytics/summary");
  return data;
}