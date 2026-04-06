import React from "react";
import { useBookingsflights } from "@/routes/useApiData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FlightsBookingsChart: React.FC = () => {
  const { data: flightsbookings, isLoading } = useBookingsflights();

  if (isLoading) return <p>Loading Flight Bookings Chart...</p>;

  const totalBookings = flightsbookings?.length || 0;

  const data = {
    labels: ["Flight Bookings"], 
    datasets: [
      {
        label: "Total Flight Bookings",
        data: [totalBookings],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

export default FlightsBookingsChart;
