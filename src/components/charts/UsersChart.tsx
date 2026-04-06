import React from "react";
import { useUsers } from "@/routes/useApiData";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UsersChart: React.FC = () => {
  const { data: users, isLoading } = useUsers();
  if (isLoading) return <p>Loading Users Chart...</p>;

  const months = Array.from({ length: 12 }, (_, i) => i); 
  const usersPerMonth = Array(12).fill(0);

  users?.forEach(u => {
    if (u.createdAt) {
      const month = new Date(u.createdAt).getMonth();
      usersPerMonth[month] += 1;
    }
  });

  const data = {
    labels: months.map(m => new Date(0, m).toLocaleString('default', { month: 'short' })),
    datasets: [
      {
        label: 'New Users',
        data: usersPerMonth,
        fill: false,
        borderColor: 'rgba(59, 130, 246, 0.7)',
        tension: 0.3
      }
    ]
  };

  return <Line data={data} />;
};

export default UsersChart;
