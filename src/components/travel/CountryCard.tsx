import { Link } from "react-router-dom";
import { Country } from "@/types/country";
import { MapPin } from "lucide-react";

interface CountryCardProps {
  country: Country;
  index: number;
}

const CountryCard = ({ country, index }: CountryCardProps) => {
  return (
    <Link
      to={`/country/${country.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="relative overflow-hidden rounded-lg shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
        <div className="aspect-[4/5] overflow-hidden relative">
          <img
            src={country.image}
            alt={`${country.name} destination`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-center gap-2 text-white/90 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Explore</span>
          </div>
          <h3 className="font-serif text-2xl font-semibold text-white transition-transform duration-300 group-hover:translate-x-2">
            {country.name}
          </h3>
        </div>

        <div className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:scale-110">
          <svg
            className="h-5 w-5 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </article>
    </Link>
  );
};

export default CountryCard;
