import { useEffect, useState } from "react";
import { getAdminAnalytics, getAllOrders } from "../../../services/orderService";
import {
  buildDayComparisonData,
  buildItemSalesPercentageData,
  buildMonthComparisonData,
  buildYearComparisonData,
  calculateAverageOrderValue,
  calculateCancellationRate,
  calculatePeakHour,
} from "../utils/analyticsHelpers";

export default function useAnalytics() {
  const [data, setData] = useState({
    peakHour: "N/A",
    topSellingItem: "N/A",
    averageOrderValue: 0,
    cancellationRate: 0,
    todayRevenue: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0,
    yearlyRevenue: 0,
    yearlyOrders: 0,
    topSellingToday: [],
    topSellingThisMonth: [],
    orders: [],
    dayComparisonData: [],
    monthComparisonData: [],
    yearComparisonData: [],
    itemSalesPercentageData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const [analytics, orders] = await Promise.all([
        getAdminAnalytics(),
        getAllOrders(),
      ]);

      const allOrders = Array.isArray(orders) ? orders : [];

      const topSellingItem =
        analytics?.topSellingThisMonth?.[0]?.name ||
        analytics?.topSellingToday?.[0]?.name ||
        "N/A";

      setData({
        peakHour: calculatePeakHour(allOrders),
        topSellingItem,
        averageOrderValue: calculateAverageOrderValue(allOrders),
        cancellationRate: calculateCancellationRate(allOrders),
        todayRevenue: analytics?.todayRevenue || 0,
        todayOrders: analytics?.todayOrders || 0,
        monthlyRevenue: analytics?.monthlyRevenue || 0,
        monthlyOrders: analytics?.monthlyOrders || 0,
        yearlyRevenue: analytics?.yearlyRevenue || 0,
        yearlyOrders: analytics?.yearlyOrders || 0,
        topSellingToday: analytics?.topSellingToday || [],
        topSellingThisMonth: analytics?.topSellingThisMonth || [],
        orders: allOrders,
        dayComparisonData: buildDayComparisonData(allOrders, 7),
        monthComparisonData: buildMonthComparisonData(allOrders, 6),
        yearComparisonData: buildYearComparisonData(allOrders, 5),
        itemSalesPercentageData: buildItemSalesPercentageData(
          analytics?.topSellingThisMonth || []
        ),
      });
    } catch (err) {
      console.error("Analytics load error:", err.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    data,
    loading,
    error,
    reload: loadAnalytics,
  };
}