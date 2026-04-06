import React from "react";
import { useUsers } from "@/routes/useApiData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to Capitalize text
const formatCountryName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

const CountriesChart: React.FC = () => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <p>Loading Countries Chart...</p>;

  const usersPerCountry: Record<string, number> = {};

  users?.forEach((u) => {
    if (!u.country) return;

    // Normalize all (lowercase)
    const normalized = u.country.trim().toLowerCase();

    usersPerCountry[normalized] = (usersPerCountry[normalized] || 0) + 1;
  });

  const labels = Object.keys(usersPerCountry).map((c) =>
    formatCountryName(c)
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Users per Country",
        data: Object.values(usersPerCountry),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CountriesChart;
