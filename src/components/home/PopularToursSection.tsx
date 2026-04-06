// import { Star, Clock, ArrowRight } from "lucide-react";
// import { Button } from "@/components/UI/button";
// import { Badge } from "@/components/UI/badge";
// import { useAppSelector } from "@/routes/hooks";

// export const PopularToursSection = () => {
//   const { popularTours: tours, loading } = useAppSelector((state) => state.tours);

//   if (loading) {
//     return (
//       <section className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4 text-center">
//           <p className="text-muted-foreground">Loading tours...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20 bg-muted/30">
//       <div className="container mx-auto px-4">
//         {/* Section Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//             Popular <span className="text-primary">Tours</span>
//           </h2>
//         </div>

//         {/* Tours Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {tours.map((tour) => (
//             <div
//               key={tour.id}
//               className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <div className="relative aspect-[3/4] overflow-hidden">
//                 <img
//                   src={tour.image}
//                   alt={tour.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//                 {tour.badge && (
//                   <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
//                     {tour.badge}
//                   </Badge>
//                 )}
//               </div>
              
//               <div className="p-4">
//                 <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//                   {tour.title}
//                 </h3>
                
//                 {tour.duration && (
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//                     <Clock className="h-4 w-4" />
//                     {tour.duration}
//                   </div>
//                 )}
                
//                 <div className="flex items-center gap-1 mb-3">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < tour.rating
//                           ? "text-yellow-400 fill-yellow-400"
//                           : "text-muted"
//                       }`}
//                     />
//                   ))}
//                   {tour.reviews && (
//                     <span className="text-sm text-muted-foreground ml-1">
//                       ({tour.reviews} Review)
//                     </span>
//                   )}
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-muted-foreground">From</span>
//                   {tour.originalPrice && (
//                     <span className="text-sm text-muted-foreground line-through">
//                       ${tour.originalPrice.toLocaleString()}
//                     </span>
//                   )}
//                   <span className="text-lg font-bold text-primary">
//                     ${tour.price.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* See More Button */}
//         <div className="text-center mt-10">
//           <Button variant="outline" className="gap-2">
//             See More <ArrowRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };
