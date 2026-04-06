import { useAppSelector } from "@/routes/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Plane, Calendar, Ticket, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function FlightBookings() {
  const { userBookings: flightBookings, isLoading: flightLoading } =
    useAppSelector((state) => state.flightBooking);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 bg-white rounded-xl p-4 shadow-md border-l-4 border-cyan-400">
        <div className="p-2 bg-cyan-100 rounded-lg">
          <Plane className="h-6 w-6 text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Flight Bookings</h2>
      </div>

      {flightLoading ? (
        <Card className="bg-white border-2 border-slate-200 shadow-lg">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-200 border-t-cyan-500"></div>
              <p className="text-slate-600 font-medium">Loading flight bookings...</p>
            </div>
          </CardContent>
        </Card>
      ) : flightBookings.length === 0 ? (
        <Card className="bg-white border-2 border-dashed border-slate-300 shadow-lg hover:border-cyan-400 transition-colors duration-300">
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Plane className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-800 mb-2">No Flight Bookings</p>
            <p className="text-slate-600 text-sm">You haven't booked any flights yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flightBookings.map((booking) => (
            <Card 
              key={booking.id} 
              className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:border-cyan-400 transition-all duration-300 mb-8"
            >
              <CardHeader className="border-b-2 border-slate-100 pb-4 bg-gradient-to-r from-cyan-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 font-bold">
                  <div className="p-1.5 bg-cyan-100 rounded-lg">
                    <Plane className="h-4 w-4 text-cyan-600" />
                  </div>
                  Flight Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center py-2 hover:bg-slate-50 rounded-lg px-2 transition-colors">
                  <span className="text-slate-600 text-sm flex items-center gap-2 font-medium">
                    <Ticket className="h-4 w-4 text-cyan-500" />
                    Tickets
                  </span>
                  <span className="text-slate-800 font-bold">{booking.tickets}</span>
                </div>

                <div className="flex justify-between items-center py-2 hover:bg-slate-50 rounded-lg px-2 transition-colors">
                  <span className="text-slate-600 text-sm flex items-center gap-2 font-medium">
                    <Plane className="h-4 w-4 text-cyan-500" />
                    Type
                  </span>
                  <span className="text-slate-800 font-bold">{booking.type}</span>
                </div>

                <div className="flex justify-between items-center py-2 bg-cyan-50 rounded-lg px-3 border-2 border-cyan-200 hover:border-cyan-400 transition-colors">
                  <span className="text-slate-700 text-sm flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4 text-cyan-600" />
                    From
                  </span>
                  <span className="text-slate-800 font-bold text-sm">{booking.from}</span>
                </div>

                <div className="flex justify-between items-center py-2 bg-slate-50 rounded-lg px-3 border-2 border-slate-200 hover:border-slate-400 transition-colors">
                  <span className="text-slate-700 text-sm flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    To
                  </span>
                  <span className="text-slate-800 font-bold text-sm">{booking.to}</span>
                </div>

                <div className="flex justify-between items-center py-2 bg-cyan-50 rounded-lg px-3 border-2 border-cyan-200 hover:border-cyan-400 transition-colors">
                  <span className="text-slate-700 text-sm flex items-center gap-2 font-semibold">
                    <Calendar className="h-4 w-4 text-cyan-600" />
                    Date
                  </span>
                  <span className="text-slate-800 font-bold text-sm">
                    {format(new Date(booking.date), "MMM dd, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}