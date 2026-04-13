import { useMemo, useState } from "react";
import StatCard from "./components/StatCard";
import RevenueBarChart from "./components/RevenueBarChart";
import ItemSalesPieChart from "./components/ItemSalesPieChart";
import useAnalytics from "./hooks/useAnalytics";
import { formatCurrency } from "./utils/analyticsHelpers";

const PERIOD_OPTIONS = [
  { key: "days", label: "Days" },
  { key: "months", label: "Months" },
  { key: "years", label: "Years" },
];

export default function AnalyticsDashboard() {
  const { data, loading, error } = useAnalytics();
  const [selectedPeriod, setSelectedPeriod] = useState("days");

  const primaryCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(data.todayRevenue),
      helperText: `${data.todayOrders} orders today`,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(data.monthlyRevenue),
      helperText: `${data.monthlyOrders} orders this month`,
    },
    {
      title: "Yearly Revenue",
      value: formatCurrency(data.yearlyRevenue),
      helperText: `${data.yearlyOrders} orders this year`,
    },
  ];

  const insightCards = [
    {
      title: "Peak Hour",
      value: data.peakHour,
    },
    {
      title: "Top Selling Item",
      value: data.topSellingItem,
    },
    {
      title: "Average Order Value",
      value: formatCurrency(data.averageOrderValue),
    },
    {
      title: "Cancellation Rate",
      value: `${data.cancellationRate}%`,
    },
  ];

  const comparisonConfig = useMemo(() => {
    if (selectedPeriod === "months") {
      return {
        title: "Revenue Comparison by Month",
        data: data.monthComparisonData,
      };
    }

    if (selectedPeriod === "years") {
      return {
        title: "Revenue Comparison by Year",
        data: data.yearComparisonData,
      };
    }

    return {
      title: "Revenue Comparison by Day",
      data: data.dayComparisonData,
    };
  }, [selectedPeriod, data.dayComparisonData, data.monthComparisonData, data.yearComparisonData]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Analytics
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Revenue, order trends, and operational insights.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {primaryCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            helperText={card.helperText}
            loading={loading}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {insightCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            loading={loading}
          />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {comparisonConfig.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const active = selectedPeriod === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedPeriod(option.key)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <RevenueBarChart
            title=""
            data={comparisonConfig.data}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ItemSalesPieChart
          title="Selling Item Percentage (This Month)"
          data={data.itemSalesPercentageData}
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Top Selling This Month
          </h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : data.topSellingThisMonth.length === 0 ? (
              <p className="text-slate-500">No monthly sales data.</p>
            ) : (
              data.topSellingThisMonth.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      Quantity: {item.totalQuantity}
                    </p>
                  </div>
                  <p className="font-semibold text-orange-600">
                    {formatCurrency(item.totalRevenue)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Top Selling Today</h2>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : data.topSellingToday.length === 0 ? (
            <p className="text-slate-500">No sales data for today.</p>
          ) : (
            data.topSellingToday.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    Quantity: {item.totalQuantity}
                  </p>
                </div>
                <p className="font-semibold text-orange-600">
                  {formatCurrency(item.totalRevenue)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}