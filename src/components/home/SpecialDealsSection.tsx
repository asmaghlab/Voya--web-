import { Button } from "@/components/UI/Button";

export const SpecialDealsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=800&fit=crop')",
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl m-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Special Deals!
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Make sure to check out these special
            <span className="block text-2xl font-semibold mt-2">promotions</span>
          </p>
          {/* <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
          >
            See Tours
          </Button> */}
        </div>
      </div>
    </section>
  );
};
