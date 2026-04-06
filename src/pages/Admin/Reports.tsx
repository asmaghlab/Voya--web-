import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import {
  FileDown,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
  Plane,
  Hotel,
} from "lucide-react";

import AdminSidebar from "@/layouts/DashboardLayout/DashboardLayout";
import { Button } from "@/components/UI/Button";
import { flightBookingApi, hotelBookingApi } from "@/utils/api";

import {
  FlightBookingRow,
  HotelBookingRow,
  BookingStats,
  paginationTexts,
} from "@/types/reports.types";

import {
  calculateBookingStats,
  formatDate,
  formatCurrency,
  exportPDF,
  exportExcel,
} from "@/utils/reports.utils";

export default function Reports() {
  const [flightBookings, setFlightBookings] = useState<FlightBookingRow[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBookingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const [flightsRes, hotelsRes] = await Promise.all([
          flightBookingApi.get<FlightBookingRow[]>("/flightbooking"),
          hotelBookingApi.get<any[]>("/bookings/hotelbooking"),
        ]);

        setFlightBookings(flightsRes.data ?? []);

        const mappedHotels: HotelBookingRow[] = (hotelsRes.data ?? []).map((h) => ({
          id: h.id,
          name: h.name,
          email: h.email,
          phone: h.phone,
          guest: h.guest,
          type: h.type,
          checkIn: h.checkIn,
          checkOut: h.checkOut,
          hotelName: h.hotelname,
          price: h.price,
        }));

        setHotelBookings(mappedHotels);
      } catch (err) {
        console.error(err);
        setError("Unable to load reports at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const stats: BookingStats = useMemo(
    () => calculateBookingStats(flightBookings, hotelBookings),
    [flightBookings, hotelBookings]
  );

  const flightBookingColumns: TableColumn<FlightBookingRow>[] = useMemo(
    () => [
      { name: "Name", selector: (row) => row.name, sortable: true },
      { name: "Email", selector: (row) => row.email },
      { name: "From", selector: (row) => row.from, sortable: true },
      { name: "To", selector: (row) => row.to, sortable: true },
      { name: "Airline", selector: (row) => row.airline ?? "—" },
      { name: "Tickets", selector: (row) => row.tickets, sortable: true },
      { name: "Type", selector: (row) => row.type, sortable: true },
      { name: "Date", selector: (row) => formatDate(row.date), sortable: true },
    ],
    []
  );

  const hotelBookingColumns: TableColumn<HotelBookingRow>[] = useMemo(
    () => [
      { name: "Name", selector: (row) => row.name, sortable: true },
      { name: "Email", selector: (row) => row.email },
      { name: "Phone", selector: (row) => row.phone ?? "—" },
      { name: "Hotel", selector: (row) => row.hotelName ?? "—", sortable: true },
      { name: "Guests", selector: (row) => row.guest, sortable: true },
      { name: "Type", selector: (row) => row.type, sortable: true },
      { name: "Check-in", selector: (row) => formatDate(row.checkIn), sortable: true },
      { name: "Check-out", selector: (row) => formatDate(row.checkOut), sortable: true },
    ],
    []
  );

  const summaryCards = [
    { label: "Flight Bookings", value: stats.totalFlights, icon: Plane, color: "text-blue-500" },
    { label: "Hotel Bookings", value: stats.totalHotels, icon: Hotel, color: "text-purple-500" },
  ];

  const topAirlines = useMemo(
    () =>
      Object.entries(stats.flightsByAirline)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([airline, count]) => ({ name: airline, count })),
    [stats.flightsByAirline]
  );

  const topHotels = useMemo(
    () =>
      Object.entries(stats.hotelsByName)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([hotel, count]) => ({ name: hotel, count })),
    [stats.hotelsByName]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      

      <div className="lg:ml-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
              <p className="text-slate-600 text-sm mt-1">Overview of all bookings</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => exportPDF(flightBookings, hotelBookings, topAirlines, topHotels)}>
                <FileDown className="w-4 h-4" /> Download PDF
              </Button>

              <Button variant="secondary" onClick={() => exportExcel(flightBookings, hotelBookings, topAirlines, topHotels)}>
                <FileSpreadsheet className="w-4 h-4" /> Export Excel
              </Button>
            </div>
          </header>

          {/* Summary Cards */}
          <section className="grid gap-4 sm:grid-cols-2">
            {summaryCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl bg-white border-2 border-slate-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold mt-2 text-slate-800">{value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${color === 'text-blue-500' ? 'from-blue-100 to-cyan-100' : 'from-purple-100 to-pink-100'}`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {loading && (
            <div className="flex items-center gap-2 text-slate-700 justify-center py-8">
              <Loader2 className="animate-spin w-5 h-5" /> 
              <span>Loading reports...</span>
            </div>
          )}

          {error && !loading && (
            <div className="border-2 border-red-300 bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6 pb-8">
              {/* Flight Bookings Table */}
              <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b-2 border-cyan-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500 p-2 rounded-lg shadow-md">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Flight Bookings</h2>
                  </div>
                </div>
                <DataTable
                  columns={flightBookingColumns}
                  data={flightBookings}
                  pagination
                  responsive
                  highlightOnHover
                  paginationComponentOptions={paginationTexts}
                  customStyles={{
                    table: {
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    },
                    headRow: {
                      style: {
                        backgroundColor: '#f0fdfa',
                        borderBottom: '2px solid #a5f3fc',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0e7490',
                      },
                    },
                    rows: {
                      style: {
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #e0f2fe',
                        color: '#334155',
                        fontSize: '14px',
                        '&:hover': {
                          backgroundColor: '#f0f9ff',
                          cursor: 'pointer',
                        },
                      },
                    },
                    pagination: {
                      style: {
                        backgroundColor: '#ffffff',
                        borderTop: '2px solid #a5f3fc',
                        color: '#0e7490',
                        minHeight: '56px',
                      },
                    },
                  }}
                />
              </div>

              {/* Hotel Bookings Table */}
              <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 p-2 rounded-lg shadow-md">
                      <Hotel className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Hotel Bookings</h2>
                  </div>
                </div>
                <DataTable
                  columns={hotelBookingColumns}
                  data={hotelBookings}
                  pagination
                  responsive
                  highlightOnHover
                  paginationComponentOptions={paginationTexts}
                  customStyles={{
                    table: {
                      style: {
                        backgroundColor: '#ffffff',
                      },
                    },
                    headRow: {
                      style: {
                        backgroundColor: '#faf5ff',
                        borderBottom: '2px solid #e9d5ff',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#7e22ce',
                      },
                    },
                    rows: {
                      style: {
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #f3e8ff',
                        color: '#334155',
                        fontSize: '14px',
                        '&:hover': {
                          backgroundColor: '#faf5ff',
                          cursor: 'pointer',
                        },
                      },
                    },
                    pagination: {
                      style: {
                        backgroundColor: '#ffffff',
                        borderTop: '2px solid #e9d5ff',
                        color: '#7e22ce',
                        minHeight: '56px',
                      },
                    },
                  }}
                />
              </div>

              {/* Top Airlines & Hotels */}
              <section className="grid md:grid-cols-2 gap-6">
                {/* Top Airlines */}
                <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg shadow-md">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Top Airlines</h2>
                    </div>
                  </div>
                  <DataTable
                    columns={[
                      { name: "Airline", selector: (row: [string, number]) => row[0], sortable: true, grow: 2 },
                      { name: "Bookings", selector: (row: [string, number]) => row[1], sortable: true, style: { textAlign: "right" }
, grow: 1 },
                    ]}
                    data={Object.entries(stats.flightsByAirline).sort(([, a], [, b]) => b - a).slice(0, 5)}
                    dense
                    highlightOnHover
                    customStyles={{
                      table: {
                        style: {
                          backgroundColor: '#ffffff',
                        },
                      },
                      headRow: {
                        style: {
                          backgroundColor: '#eff6ff',
                          borderBottom: '2px solid #bfdbfe',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1e40af',
                        },
                      },
                      rows: {
                        style: {
                          backgroundColor: '#ffffff',
                          borderBottom: '1px solid #dbeafe',
                          color: '#334155',
                          fontSize: '14px',
                          '&:hover': {
                            backgroundColor: '#f0f9ff',
                            cursor: 'pointer',
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* Top Hotels */}
                <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b-2 border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-lg shadow-md">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Top Hotels</h2>
                    </div>
                  </div>
                  <DataTable
                    columns={[
                      { name: "Hotel", selector: (row: [string, number]) => row[0], sortable: true, grow: 2 },
                      { name: "Bookings", selector: (row: [string, number]) => row[1], sortable: true, style: { textAlign: "right" }
, grow: 1 },
                    ]}
                    data={Object.entries(stats.hotelsByName).sort(([, a], [, b]) => b - a).slice(0, 5)}
                    dense
                    highlightOnHover
                    customStyles={{
                      table: {
                        style: {
                          backgroundColor: '#ffffff',
                        },
                      },
                      headRow: {
                        style: {
                          backgroundColor: '#f0fdf4',
                          borderBottom: '2px solid #bbf7d0',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#15803d',
                        },
                      },
                      rows: {
                        style: {
                          backgroundColor: '#ffffff',
                          borderBottom: '1px solid #dcfce7',
                          color: '#334155',
                          fontSize: '14px',
                          '&:hover': {
                            backgroundColor: '#f0fdf4',
                            cursor: 'pointer',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}