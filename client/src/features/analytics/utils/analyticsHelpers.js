export function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function calculatePeakHour(orders = []) {
  const hourMap = {};

  orders.forEach((order) => {
    if (!order.createdAt) return;

    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) return;

    const hour = date.getHours();
    hourMap[hour] = (hourMap[hour] || 0) + 1;
  });

  if (Object.keys(hourMap).length === 0) {
    return "N/A";
  }

  const busiestHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0][0];
  const startHour = Number(busiestHour);
  const endHour = (startHour + 1) % 24;

  const formatHour = (hour) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:00 ${suffix}`;
  };

  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

export function calculateCancellationRate(orders = []) {
  const totalOrders = orders.length;
  if (totalOrders === 0) return 0;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  return Number(((cancelledOrders / totalOrders) * 100).toFixed(1));
}

export function calculateAverageOrderValue(orders = []) {
  const validOrders = orders.filter((order) => order.status !== "Cancelled");

  if (validOrders.length === 0) return 0;

  const totalRevenue = validOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  return Math.round(totalRevenue / validOrders.length);
}

export function buildItemSalesPercentageData(items = []) {
  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.totalQuantity || 0),
    0
  );

  if (!totalQuantity) return [];

  return items.map((item) => ({
    name: item.name,
    value: Number(
      ((Number(item.totalQuantity || 0) / totalQuantity) * 100).toFixed(1)
    ),
    quantity: Number(item.totalQuantity || 0),
    revenue: Number(item.totalRevenue || 0),
  }));
}

export function buildDayComparisonData(orders = [], days = 7) {
  const result = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - i);

    const next = new Date(date);
    next.setDate(date.getDate() + 1);

    const label =
      i === 0
        ? "Today"
        : i === 1
        ? "Yesterday"
        : date.toLocaleDateString("en-IN", { weekday: "short" });

    const filtered = orders.filter((order) => {
      if (!order.createdAt || order.status === "Cancelled") return false;
      const created = new Date(order.createdAt);
      return created >= date && created < next;
    });

    const revenue = filtered.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    result.push({
      name: label,
      revenue,
      orders: filtered.length,
    });
  }

  return result;
}

export function buildMonthComparisonData(orders = [], months = 6) {
  const result = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const label = start.toLocaleDateString("en-IN", { month: "short" });

    const filtered = orders.filter((order) => {
      if (!order.createdAt || order.status === "Cancelled") return false;
      const created = new Date(order.createdAt);
      return created >= start && created < end;
    });

    const revenue = filtered.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    result.push({
      name: label,
      revenue,
      orders: filtered.length,
    });
  }

  return result;
}

export function buildYearComparisonData(orders = [], years = 5) {
  const result = [];
  const now = new Date();

  for (let i = years - 1; i >= 0; i -= 1) {
    const year = now.getFullYear() - i;
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const filtered = orders.filter((order) => {
      if (!order.createdAt || order.status === "Cancelled") return false;
      const created = new Date(order.createdAt);
      return created >= start && created < end;
    });

    const revenue = filtered.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    result.push({
      name: String(year),
      revenue,
      orders: filtered.length,
    });
  }

  return result;
}