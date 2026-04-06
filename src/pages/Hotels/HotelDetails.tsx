

import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Star, MapPin, Phone, Globe } from "lucide-react";
import { fetchHotelById } from "@/features/hotels/hotelsSlice";
import HotelReviews from "@/components/hotel/hotelReviews";
import { Helmet } from "react-helmet";
import { AppDispatch, RootState } from "@/routes/store";
import { Link } from "react-router-dom";
import Spinner from "../Flights/FlightsComponents/spinner";
import { useState } from "react";
import { HotelBookingForm } from "../booking/HotelBookingForm";



export default function HotelDetails() {
  const [openBooking, setOpenBooking] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { hotel, loading, error } = useSelector(
    (state: RootState) => state.hotel
  );
  const { id } = useParams<{ id: string }>();
  console.log("Hotel id from search params:", id);
  // Scroll Animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 40]);
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const imageX = useTransform(scrollY, [0, 300], [0, -20]);

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(id));
    }
  }, [dispatch, id]);

  if (!hotel || hotel.length === 0) {
    return (
      <div className="p-10 text-center text-red-500">Hotel not found ⚠️</div>
    );
  }
  if (loading) {
    return (
        <Spinner />
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }

  const hotelDetails = hotel[0];


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Voya | Hotels Details</title>
        <link rel="canonical" href="http://mysite.com/HotelsDetails" />
      </Helmet>
      <main className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
        {/* Background */}
        <img
          src={hotelDetails.images?.[0]}
          alt={hotelDetails.name}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-100"
        />
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Glass Container */}
        <div className="relative z-10 container mx-auto py-10 space-y-12 bg-white/10 backdrop-blur-md p-6 max-w-full overflow-hidden rounded-none">
          {/* Back Button */}
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white"
          >
            <ArrowLeft size={20} /> Back
          </Link>

          {/* Hero Section */}
          <motion.div
            style={{ y: heroY }}
            className="flex flex-col lg:flex-row items-center  justify-between gap-8"
          >
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6 max-w-2xl"
            >
              <h1 className="text-6xl font-extrabold">{hotelDetails.name}</h1>
              <div className="flex items-center gap-3 text-yellow-400">
                <Star className="fill-yellow-400" />
                <span className="font-bold text-xl">{hotelDetails.rating}</span>
                <span className="text-white/80">
                  ({hotelDetails.reviewCount} reviews)
                </span>
              </div>
              <p className="text-lg text-white/90">
                {hotelDetails.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin /> {hotelDetails.address}
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Phone /> {hotelDetails.phone}
                </div>
                <a
                  href={hotelDetails.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-400"
                >
                  <Globe /> Website
                </a>
              </div>
              <motion.button
                onClick={() => setOpenBooking(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg shadow-2xl transition-all"
              >
                Book Now
              </motion.button>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              style={{ scale: imageScale, x: imageX }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-[27rem] h-[27rem] rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex-shrink-0"
            >
              <img
                src={hotelDetails.images[0]}
                alt={hotelDetails.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Amenities Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-4">
              {hotelDetails.amenities.map((amenity, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white/90"
                >
                  {amenity}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Offers Section */}
          <section className="space-y-8 ">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              Offers
            </h2>
            <div className="flex flex-wrap gap-4">
              {hotelDetails.offers.map((offer, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white/90"
                >
                  {offer}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Price & Stay */}
          <section className="space-y-2 text-white/90 ">
            <div className="text-lg font-semibold">
              Price per night:{" "}
              <span className="font-bold text-xl">
                ${hotelDetails.pricePerNight}
              </span>{" "}
              {hotelDetails.currency}
            </div>
            <div className="text-lg font-semibold">
              Stay Duration:{" "}
              <span className="font-bold">
                {hotelDetails.stayDuration} nights
              </span>
            </div>
            <div className="text-lg font-semibold">
              Check-In:{" "}
              <span className="font-bold">{hotelDetails.checkIn}</span> |
              Check-Out:{" "}
              <span className="font-bold">{hotelDetails.checkOut}</span>
            </div>
          </section>
          {/* ⭐ Reviews Section — same style as flight cards */}
          <HotelReviews />
        </div>
          {openBooking && (
            <HotelBookingForm
              hotelId={String(hotelDetails.id)}
              hotelName={hotelDetails.name}
              onClose={() => setOpenBooking(false)}
              onSuccess={() => setOpenBooking(false)}
            />
          )}
      </main>
    </>
  );
}
