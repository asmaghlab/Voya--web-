import React from "react";
import { useBookingshotels } from "@/routes/useApiData";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HotelsBooking: React.FC = () => {
  const { data: hotelsbookings, isLoading } = useBookingshotels();
  if (isLoading) return <p>Loading Bookings Chart...</p>;

  const bookingsPerHotel: Record<string, number> = {};
  hotelsbookings?.forEach(b => {
    const hotelName = b.hotelName || "Hotels Booking";    
    bookingsPerHotel[hotelName] = (bookingsPerHotel[hotelName] || 0) + 1;
  });

  const data = {
    labels: Object.keys(bookingsPerHotel),
    datasets: [
      {
        label: 'Total Hotel Bookings',
        data: Object.values(bookingsPerHotel),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        }
      }
    }
  };

  return (
    <div className="w-full h-64 sm:h-72 md:h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HotelsBooking;
