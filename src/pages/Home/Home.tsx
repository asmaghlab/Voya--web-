import { Helmet } from "react-helmet-async";
import { Header } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
//import { HeroSection } from "@/components/home/HeroSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { FreshlyAddedSection } from "@/components/home/FreshlyAddedSection";
import { HotelRoomsSection } from "@/components/home/HotelRoomsSection";
import { SpecialDealsSection } from "@/components/home/SpecialDealsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import ModernTravelChatBot from "../Chat/ChatBot";
import Index from "@/components/home/hero";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Helmet SEO */}
      <Helmet>
        <title>Voya | Home</title>
        <meta
          name="description"
          content="Discover top destinations, hotels, tours, and exclusive deals with Voya Travel. Your journey starts here."
        />
        <meta
          name="keywords"
          content="travel, hotels, tours, flights, destinations, booking"
        />
      </Helmet>
      <Header />
      <main>
        <Index />
        <DestinationsSection />
        <ModernTravelChatBot/>
        <FreshlyAddedSection />
        <HotelRoomsSection />
        <SpecialDealsSection />
        <NewsletterSection />
        <TestimonialsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;