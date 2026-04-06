import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Users, Calendar, Building2, User, Phone } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { createHotelBooking, clearError } from "@/features/booking/hotelBookingSlice";
import { showErrorAlert, showSuccessAlert } from "@/components/Common/CustomSwal";

// Validation Schema
const schema = yup.object({
  name: yup.string().required("Name is required").min(2),
  email: yup.string().required("Email is required").email(),
  phone: yup.string().required("Phone number is required").matches(/^[0-9]{10,15}$/),
  guest: yup.number().required().min(1).integer(),
  type: yup.string().required("Booking type is required"),
  checkIn: yup.string().required("Check-in is required").test(
    "is-future",
    "Check-in date must be in the future",
    (value) => (value ? new Date(value).getTime() >= new Date().setHours(0, 0, 0, 0) : false)
  ),
  checkOut: yup.string().required("Check-out is required").test(
    "is-after-checkin",
    "Check-out must be after check-in",
    function (value) {
      const { checkIn } = this.parent;
      return value && checkIn ? new Date(value) > new Date(checkIn) : false;
    }
  ),
  hotelname: yup.string().required(),
   cardDetails: yup
    .string()
    .required("Card number is required")
    .matches(
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
      "Enter a valid Visa or MasterCard number"
    ),
      cvv: yup.string().required("CVV is required").matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
});

type HotelBookingFormData = yup.InferType<typeof schema>;

interface HotelBookingFormProps {
  hotelId: string;
  hotelName: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const HotelBookingForm = ({ hotelId, hotelName, onSuccess, onClose }: HotelBookingFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading: bookingLoading, error: bookingError } = useAppSelector((state) => state.hotelBooking);

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm < HotelBookingFormData > ({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      guest: 1,
      type: "",
      checkIn: "",
      checkOut: "",
      hotelname: hotelName,
      cardDetails: "",
    },
  });

  // Assign hotel name automatically
  useEffect(() => {
    setValue("hotelname", hotelName);
  }, [hotelName, setValue]);

  useEffect(() => {
    if (bookingError) {
      toast.error(bookingError);
      dispatch(clearError());
    }
  }, [bookingError, dispatch]);

  const onSubmit = async (data: HotelBookingFormData) => {
    if (!user) {
      showErrorAlert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await dispatch(
        createHotelBooking({
          name: data.name,
          email: data.email,
          phone: data.phone,
          guest: data.guest,
          type: data.type,
          checkIn: new Date(data.checkIn).toISOString(),
          checkOut: new Date(data.checkOut).toISOString(),
          hotelname: hotelName,
          hotelId,
          payment: "paid",
        })
      ).unwrap();

      showSuccessAlert("Hotel booking created successfully!");
      reset();
      onSuccess?.();
    } catch {
      showErrorAlert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-transparent backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh]">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Book Your Hotel</h2>
              <p className="text-gray-400">Fill in your details to complete your reservation</p>
              <p className="text-gray-300 mt-1 font-medium">Hotel: {hotelName}</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
            {/* Name */}
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

            {/* Guests & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors ">
                  <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Number of Guests</legend>
                  <div className="relative px-3 pb-2">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Controller name="guest" control={control} render={({ field }) => (
                      <Input {...field} type="number" min={1} className="pl-8 h-6 bg-transparent text-white border-0 focus:ring-0" disabled={bookingLoading} />
                    )} />
                  </div>
                </fieldset>
                {errors.guest && <p className="text-sm text-red-400">{errors.guest.message}</p>}
              </div>

              <div className="space-y-2">
                <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors bg-gray-800">
                  <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Booking Type</legend>
                  <div className="relative px-3 pb-2">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none z-10" />
                    <Controller name="type" control={control} render={({ field }) => (
                      <select {...field} className="pl-8 h-6 w-full border-0 bg-gray-800 text-white focus:outline-none appearance-none cursor-pointer" disabled={bookingLoading}>
                        <option value="">Select type</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Budget">Budget</option>
                        <option value="Resort">Resort</option>
                        <option value="Boutique">Boutique</option>
                        <option value="Business">Business</option>
                        <option value="Family">Family</option>
                      </select>
                    )} />
                  </div>
                </fieldset>
                {errors.type && <p className="text-sm text-red-400">{errors.type.message}</p>}
              </div>
            </div>

            {/* Check-in / Check-out */}
        <div className="grid grid-cols-12 gap-4">
  {/* Check-in */}
  <div className=" col-span-6 min-w-0 w-full">
    <fieldset className="w-full min-w-0 border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
      <legend className="ml-2 px-2 text-xs font-medium text-blue-400">
        Check-in Date
      </legend>

      <div className="relative px-3  w-full min-w-0">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Controller
          name="checkIn"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              className="pl-8 h-10 w-full min-w-0 bg-transparent text-white border-0 focus:ring-0"
              disabled={bookingLoading}
            />
          )}
        />
      </div>
    </fieldset>
    {errors.checkIn && (
      <p className="text-sm text-red-400">{errors.checkIn.message}</p>
    )}
  </div>

  {/* Check-out */}
  <div className=" col-span-6 min-w-0 w-full">
    <fieldset className="w-full min-w-0 border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
      <legend className="ml-2 px-2 text-xs font-medium text-blue-400">
        Check-out Date
      </legend>

      <div className="relative px-3 w-full min-w-0">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Controller
          name="checkOut"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              className="pl-8 h-10 w-full min-w-0 bg-transparent text-white border-0 focus:ring-0"
              disabled={bookingLoading}
            />
          )}
        />
      </div>
    </fieldset>
    {errors.checkOut && (
      <p className="text-sm text-red-400">{errors.checkOut.message}</p>
    )}
  </div>
</div>



            <div className="grid grid-cols-12 gap-4">
            {/* Card Details */}
            <div className=" col-span-8">
              <fieldset className="border-2 border-gray-700 rounded-xl focus-within:border-blue-500 transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-blue-400">Card Details</legend>
                <div className="relative px-3 pb-2">
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
          <div className="space-y-2 col-span-4">

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
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg disabled:opacity-50" disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Hotel"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
