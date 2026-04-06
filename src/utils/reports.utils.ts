import { FlightBookingRow, HotelBookingRow, BookingStats } from "../types/reports.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* =======================
   Formatting Helpers
======================= */
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString();

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

/* =======================
   Statistics Calculation
======================= */
export const calculateBookingStats = (
  flights: FlightBookingRow[],
  hotels: HotelBookingRow[]
): BookingStats => {
  const stats: BookingStats = {
    totalFlights: flights.length,
    totalHotels: hotels.length,
    totalRevenue: 0,
    flightsByAirport: {},
    hotelsByName: {},
    flightsByAirline: {},
    bookingsByType: { flightTypes: {}, hotelTypes: {} },
  };

  flights.forEach((f) => {
    stats.totalRevenue += f.price ?? 0;
    stats.flightsByAirport[f.from] = (stats.flightsByAirport[f.from] || 0) + 1;
    if (f.airline) stats.flightsByAirline[f.airline] = (stats.flightsByAirline[f.airline] || 0) + 1;
    stats.bookingsByType.flightTypes[f.type] = (stats.bookingsByType.flightTypes[f.type] || 0) + 1;
  });

  hotels.forEach((h) => {
    stats.totalRevenue += h.price ?? 0;
    if (h.hotelName) stats.hotelsByName[h.hotelName] = (stats.hotelsByName[h.hotelName] || 0) + 1;
    stats.bookingsByType.hotelTypes[h.type] = (stats.bookingsByType.hotelTypes[h.type] || 0) + 1;
  });

  return stats;
};

/* =======================
   Export PDF
======================= */
export const exportPDF = (flights: FlightBookingRow[], hotels: HotelBookingRow[]) => {
  const doc = new jsPDF();

  doc.text("Flight Bookings", 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [["Name", "From", "To", "Airline", "Tickets"]],
    body: flights.map((f) => [f.name, f.from, f.to, f.airline ?? "-", f.tickets]),
  });

  doc.addPage();
  doc.text("Hotel Bookings", 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [["Name", "Hotel", "Guests", "Type"]],
    body: hotels.map((h) => [h.name, h.hotelName ?? "-", h.guest, h.type]),
  });

  doc.save("booking-reports.pdf");
};

/* =======================
   Export Excel
======================= */
export const exportExcel = (flights: FlightBookingRow[], hotels: HotelBookingRow[]) => {
  const wb = XLSX.utils.book_new();
  const flightSheet = XLSX.utils.json_to_sheet(flights);
  const hotelSheet = XLSX.utils.json_to_sheet(hotels);
  XLSX.utils.book_append_sheet(wb, flightSheet, "Flights");
  XLSX.utils.book_append_sheet(wb, hotelSheet, "Hotels");
  XLSX.writeFile(wb, "booking-reports.xlsx");
};
