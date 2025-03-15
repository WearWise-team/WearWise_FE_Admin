"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import LineChart from "../../components/LineChart";
import { getAllUser, getUsersIsDeleted } from "@/api/user/page";
import { getSuppliers } from "@/api/supplier/page";
import User from "@/components/User";
import Supplier from "@/components/Supplier";

// Hàm lấy 6 tháng gần nhất
const getLastSixMonths = () => {
  const today = new Date("2025-03-14"); // Ngày hiện tại theo yêu cầu
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return months; // Ví dụ: ["2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03"]
};

// Hàm tính số lượng theo tháng
const groupByMonth = (data, dateKey) => {
  const monthlyData = {};
  data.forEach((item) => {
    const date = new Date(item[dateKey]);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });
  return monthlyData;
};

// Hàm tính doanh thu theo tháng
const groupRevenueByMonth = (orders) => {
  const monthlyRevenue = {};
  orders.forEach((order) => {
    const date = new Date(order.order_date);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyRevenue[monthYear] =
      (monthlyRevenue[monthYear] || 0) + parseFloat(order.total_amount);
  });
  return monthlyRevenue;
};

// Hàm chuẩn bị dữ liệu cho biểu đồ
const prepareChartData = (monthlyData, labels) => {
  const data = labels.map((label) => monthlyData[label] || 0);
  return { labels, data };
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Revenue");
  const [users, setUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userGrowth, setUserGrowth] = useState({ labels: [], data: [] });
  const [supplierGrowth, setSupplierGrowth] = useState({
    labels: [],
    data: [],
  });
  const [orderStats, setOrderStats] = useState({
    labels: [],
    orderData: [],
    revenueData: [],
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const sixMonthsLabels = getLastSixMonths();

  // Lấy dữ liệu users
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await getAllUser();
        setUsers(response);
        const monthlyUsers = groupByMonth(response, "created_at");
        setUserGrowth(prepareChartData(monthlyUsers, sixMonthsLabels));
      } catch (error) {
        console.error("Failed to fetch active users:", error);
      }
    };
    if (
      activePage === "Suppliers" ||
      activePage === "All Users" ||
      activePage === "Revenue"
    ) {
      fetchActiveUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  useEffect(() => {
    const fetchInactiveUsers = async () => {
      try {
        const response = await getUsersIsDeleted();
        setInactiveUsers(response);
      } catch (error) {
        console.error("Failed to fetch inactive users:", error);
      }
    };
    fetchInactiveUsers();
  }, [users]);

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response);
      const monthlySuppliers = groupByMonth(
        response.filter((s) => s.created_at),
        "created_at"
      );
      setSupplierGrowth(prepareChartData(monthlySuppliers, sixMonthsLabels));
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  // Lấy dữ liệu suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getSuppliers();
        setSuppliers(response);
        const monthlySuppliers = groupByMonth(
          response.filter((s) => s.created_at),
          "created_at"
        );
        setSupplierGrowth(prepareChartData(monthlySuppliers, sixMonthsLabels));
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };
    fetchSuppliers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders");
        const data = await response.json();
        setOrders(data);
        const monthlyOrders = groupByMonth(data, "order_date");
        const monthlyRevenue = groupRevenueByMonth(data);
        setOrderStats({
          labels: sixMonthsLabels,
          orderData: sixMonthsLabels.map((label) => monthlyOrders[label] || 0),
          revenueData: sixMonthsLabels.map(
            (label) => monthlyRevenue[label] || 0
          ),
        });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "Revenue":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biểu đồ tăng trưởng người dùng */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                User Growth
              </h2>
              <div className="h-64">
                <LineChart
                  chartId="userGrowthChart"
                  data={userGrowth.data}
                  labels={userGrowth.labels}
                  title="User Growth Over Last 6 Months"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                Supplier Growth
              </h2>
              <div className="h-64">
                <LineChart
                  chartId="supplierGrowthChart"
                  data={supplierGrowth.data}
                  labels={supplierGrowth.labels}
                  title="Supplier Growth Over Last 6 Months"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Orders & Revenue
              </h2>
              <div className="h-64">
                <LineChart
                  chartId="orderRevenueChart"
                  data={orderStats.orderData}
                  revenueData={orderStats.revenueData}
                  labels={orderStats.labels}
                  title="Orders and Revenue Over Last 6 Months"
                />
              </div>
            </div>
          </div>
        );
      case "Suppliers":
        return <Supplier suppliers={suppliers} updateStatus={fetchSuppliers} />;
      case "All Users":
        return (
          <User
            users={users}
            showForm={showForm}
            selectedUser={selectedUser}
            activePage={activePage}
            key="allUsers"
          />
        );
      case "Inactive Users":
        return (
          <User
            users={inactiveUsers}
            showForm={showForm}
            selectedUser={selectedUser}
            activePage={activePage}
            key="inactiveUsers"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-100">
      <aside className="w-64">
        <Sidebar onSelect={setActivePage} />
      </aside>
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
