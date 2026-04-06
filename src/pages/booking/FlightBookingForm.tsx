import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../routes/hooks";
import { createFlightBooking, clearError } from "../../features/booking/flightBookingSlice";
import { countriesApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import { createPortal } from "react-dom";
import { showErrorAlert, showSuccessAlert } from "@/components/Common/CustomSwal";
import { Input } from "@/components/UI/Input";
import { Mail, Phone, User, Users } from "lucide-react";

/* Validation */
const schema = yup.object({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone number is required").matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),
  email: yup.string().required("Email is required").email("Invalid email address"),
  tickets: yup.number().required("Number of tickets is required").min(1, "At least 1 ticket").integer(),
  type: yup.string().required("Flight type is required"),
  from: yup.string().required("Departure location is required"),
  to: yup.string().required("Destination is required"),
  cardDetails: yup
    .string()
    .required("Card number is required")
    .matches(
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
      "Enter a valid Visa or MasterCard number"
    ),
    cvv: yup.string().required("CVV is required").matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
  date: yup.string().required("Flight date is required").test(
    "is-future",
    "Flight date must be in the future",
    (value) => {
      if (!value) return false;
      return new Date(value).getTime() >= new Date().setHours(0, 0, 0, 0);
    }
  ),
});

type FlightBookingFormData = yup.InferType<typeof schema>;

interface FlightBookingFormProps {
  onSuccess?: () => void;
  flight?: any;
  showBooking: boolean;
  setShowBooking: (val: boolean) => void;
}

export const FlightBookingForm = ({ onSuccess, flight, showBooking, setShowBooking }: FlightBookingFormProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading: bookingLoading, error: bookingError } = useAppSelector(
    (state) => state.flightBooking
  );

  const [flights, setFlights] = useState < any[] > ([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm < FlightBookingFormData > ({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      tickets: 1,
      type: flight?.type || "",
      from: flight?.from || "",
      to: flight?.to || "",
      date: "",
      cardDetails: "",
    },
  });

  /* Fetch flights */
  useEffect(() => {
    countriesApi.get("/countries").then((res) => {
      const allFlights = res.data.flatMap((c: any) =>
        c.city.flatMap((city: any) => city.flights)
      );
      setFlights(allFlights);
    });
  }, []);

  const tickets = watch("tickets");
  const type = watch("type");
  const from = watch("from");
  const to = watch("to");

  const selectedFlight = useMemo(() => {
    if (!from || !to || !type || flights.length === 0) return null;

    return flights.find(f =>
      (f.type ? f.type.toLowerCase().trim() : "economy") === type.toLowerCase().trim() &&
      f.from.toLowerCase().includes(from.toLowerCase().trim()) &&
      f.to.toLowerCase().includes(to.toLowerCase().trim())
    );
  }, [from, to, type, flights]);

  /* Computed total price */
  const computedTotalPrice = useMemo(() => {
    if (!selectedFlight || tickets <= 0) return 0;
    return selectedFlight.price * tickets;
  }, [selectedFlight, tickets]);

  /* Flight types available for the selected from/to */
  const flightTypes = useMemo(() => {
    return flights
      .filter(f => f.from.toLowerCase().includes(from.toLowerCase().trim()) &&
        f.to.toLowerCase().includes(to.toLowerCase().trim()))
      .map(f => f.type || "economy");
  }, [from, to, flights]);

  useEffect(() => {
    if (bookingError) {
      alert(bookingError);
      dispatch(clearError());
    }
  }, [bookingError, dispatch]);
  const navigate = useNavigate();

  const onSubmit = async (data: FlightBookingFormData) => {
    if (!user) {
      showErrorAlert("Please login first to complete your booking");
      navigate("/login");
      return;
    }

    if (!selectedFlight) {
      alert("Please select a valid flight");
      return;
    }

    try {
      await dispatch(
        createFlightBooking({
          name: data.name,
          phone: data.phone,
          email: data.email,
          tickets: data.tickets,
          type: data.type,
          from: data.from,
          to: data.to,
          airline: selectedFlight.airline,
          date: new Date(data.date).toISOString(),
          payment: "paid",
        })
      ).unwrap();
      showSuccessAlert(`Booking confirmed for ${data.name}!`);

      reset();
      setShowBooking(false);
      onSuccess?.();
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };


  if (!showBooking) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      onClick={() => setShowBooking(false)}
    >
      <div
        className="
       bg-black/70
        backdrop-blur-md
        p-2
        rounded-2xl
        max-w-xl
        w-full
        shadow-2xl
        transform
        transition-transform
        duration-300
        max-h-[100vh]            
               
       scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800     
      "
        onClick={(e) => e.stopPropagation()}
      >

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} >
          <h2 className="text-2xl font-bold text-center text-white mb-2">Book Ticket</h2>
          {/* Full Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors ">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Full Name</legend>
                <div className="relative px-3 pb-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Controller name="name" control={control} render={({ field }) => (
                    <Input {...field} type="text" placeholder="John Doe" className="pl-8 h-6 bg-transparent text-white border-0 focus:ring-0" disabled={bookingLoading} />
                  )} />
                </div>
              </fieldset>
              {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors ">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Email</legend>
                <div className="relative px-3 pb-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Controller name="email" control={control} render={({ field }) => (
                    <Input {...field} type="email" placeholder="your@email.com" className="pl-8 h-6 bg-transparent text-white border-0 focus:ring-0" disabled={bookingLoading} />
                  )} />
                </div>
              </fieldset>
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

          </div>
          {/* Phone */}
          <div className="space-y-2">
            <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors ">
              <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Phone Number</legend>
              <div className="relative px-3 pb-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Controller name="phone" control={control} render={({ field }) => (
                  <Input {...field} type="tel" placeholder="1234567890" className="pl-8 h-6 bg-transparent text-white border-0 focus:ring-0" disabled={bookingLoading} />
                )} />
              </div>
            </fieldset>
            {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">From</legend>

                <div className="relative px-3 pb-2">
                  <Controller
                    name="from"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Departure city"
                        className="w-full pl-2 py-1 bg-transparent text-white border-0 focus:ring-0"
                      />
                    )}
                  />
                </div>
              </fieldset>

              {errors.from && (
                <p className="text-sm text-red-400">{errors.from.message}</p>
              )}
            </div>

            {/* To */}
            <div className="space-y-2">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">To</legend>

                <div className="relative px-3 pb-2">
                  <Controller
                    name="to"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Destination city"
                        className="w-full pl-2 py-1 bg-transparent text-white border-0 focus:ring-0"
                      />
                    )}
                  />
                </div>
              </fieldset>

              {errors.to && (
                <p className="text-sm text-red-400">{errors.to.message}</p>
              )}
            </div>

          </div>

          {/* Tickets & Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tickets */}
            <div className="space-y-2">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Tickets</legend>

                <div className="relative px-3 ">
                  <Controller
                    name="tickets"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min={1}
                        className="w-full py-1 bg-transparent text-white border-0 focus:ring-0"
                      />
                    )}
                  />
                </div>
              </fieldset>

              {errors.tickets && (
                <p className="text-sm text-red-400">{errors.tickets.message}</p>
              )}
            </div>

            {/* Flight Date */}
            <div className="space-y-2">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Flight Date</legend>

                <div className="relative px-2 ">
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full py-1 bg-transparent text-white border-0 focus:ring-0"
                      />
                    )}
                  />
                </div>
              </fieldset>

              {errors.date && (
                <p className="text-sm text-red-400">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Flight Type */}
          <div className="space-y-2">
            <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors mb-2">
              <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Flight Type</legend>

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div className="relative px-3 pb-2 pt-1">
                    <select
                      {...field}
                      className="w-full appearance-none bg-transparent text-white border-0 focus:ring-0 outline-none"
                    >
                      {(flightTypes || []).map((type, idx) => (
                        <option key={idx} value={type} className="bg-[#1a1d29] text-white">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>

                    {/* السهم */}
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ▼
                    </span>
                  </div>
                )}
              />
            </fieldset>

            {errors.type && (
              <p className="text-sm text-red-400">{errors.type.message}</p>
            )}
          </div>


          {/* Summary */}
          {selectedFlight && (
            <div className="p-2  border border-gray-700 rounded-lg">
              <h3 className="text-white font-bold text-lg mb-3">Booking Summary</h3>

              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Flight:</span>
                  <span className="text-white font-semibold">{selectedFlight.airline}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="text-white font-semibold">
                    {selectedFlight.from} → {selectedFlight.to}
                  </span>
                </div> */}

                <div className="flex justify-between">
                  <span>Price per ticket:</span>
                  <span className="text-white font-semibold">${selectedFlight.price}</span>
                </div>

                <div className="flex justify-between">
                  <span>Passengers:</span>
                  <span className="text-white font-semibold">{tickets}</span>
                </div>

                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-blue-400">${computedTotalPrice}</span>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-12 gap-4">

          {/* Card Details */}
          <div className="space-y-2 col-span-9">

            <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
              <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Card Details</legend>
              <div className="relative px-2 pb-2">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Controller
                  name="cardDetails"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      className="pl-8 h-5 bg-transparent text-white border-0 focus:ring-0"
                      disabled={bookingLoading}
                    />
                  )}
                />
              </div>
            </fieldset>
            {errors.cardDetails && (
              <p className="text-sm text-red-400">{errors.cardDetails.message}</p>
            )}
          </div>

          {/* CVV */}
          <div className="space-y-2 col-span-3">

            <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
              <legend className="ml-2 px-2 text-xs font-medium text-blue-400">CVV</legend>
              <div className="relative px-2 pb-2">
                <Controller
                  name="cvv"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="123"
                      className="pl-2 h-5 bg-transparent text-white border-0 focus:ring-0"
                      disabled={bookingLoading}
                    />
                  )}
                />
              </div>
            </fieldset>
            {errors.cvv && (
              <p className="text-sm text-red-400">{errors.cvv.message}</p>
            )}
          </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowBooking(false)}
              className="flex-1 py-3 bg-[#1a1d29] text-gray-300 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={bookingLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
