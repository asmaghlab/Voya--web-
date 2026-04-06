import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HotelReviews() {
  // ⭐ Static Reviews Data
  const reviews = [
    {
      name: "John Carter",
      rating: 5,
      comment:
        "Amazing stay! The rooms were super clean and the staff were very friendly.",
      date: "Feb 12, 2024",
    },
    {
      name: "Sophia Lee",
      rating: 4,
      comment: "Great hotel with a perfect location. Would stay again!",
      date: "Jan 28, 2024",
    },
    {
      name: "Mohamed Ali",
      rating: 5,
      comment: "Exceptional service and beautiful environment.",
      date: "Dec 10, 2023",
    },
    // {
    //   name: "Emily Johnson",
    //   rating: 4,
    //   comment: "Comfortable rooms and tasty breakfast.",
    //   date: "Nov 18, 2023",
    // },
    // {
    //   name: "David Smith",
    //   rating: 5,
    //   comment: "Loved everything about this hotel. Highly recommended!",
    //   date: "Oct 5, 2023",
    // },
  ];

  return (
    <section className="space-y-8 ml-24">
      <h2 className="text-3xl font-bold">Guest Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg cursor-pointer transition-all"
          >
            {/* Name */}
            <h3 className="text-xl font-semibold mb-1">{review.name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3 text-yellow-400">
              {Array.from({ length: review.rating }).map((_, star) => (
                <Star key={star} className="fill-yellow-400" size={18} />
              ))}
            </div>

            {/* Comment */}
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              {review.comment}
            </p>

            {/* Date */}
            <div className="text-white/60 text-xs">{review.date}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
