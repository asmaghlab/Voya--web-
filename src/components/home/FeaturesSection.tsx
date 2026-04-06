import { Globe, BadgeDollarSign, Headphones } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "700 Destinations",
    description: "Our expert team handpicked all destinations in this site",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    description: "Price match within 48 hours of order confirmation",
  },
  {
    icon: Headphones,
    title: "Top Notch Support",
    description: "We are here to help, before, during, and even after your trip.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
