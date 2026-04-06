import { Hotel as HotelIcon, Plane, MapPin, Star, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Badge } from "@/components/UI/badge";
import { HotelCard } from "@/components/home/HotelCard";
import { FlightCard } from "@/components/home/FlightCard";
import { Hotel, Country, City, Flight } from "@/types/travel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";

interface SearchResultsProps {
  hotels: Hotel[];
  flights: Flight[];
  country: Country | undefined;
  city: City | undefined;
  isSearched: boolean;
}

export const SearchResults = ({
  hotels,
  flights,
  country,
  city,
  isSearched,
}: SearchResultsProps) => {
  if (!isSearched) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Discover Your Next Adventure
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Use the search above to find amazing destinations, hotels, and
              flights tailored to your preferences.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (hotels.length === 0 && flights.length === 0) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Filter className="h-10 w-10 text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              No Results Found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search criteria to find more options.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Country Info Header */}
        {country && (
          <div className="mb-12 animate-fade-up">
            <Card  className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="md:w-2/3 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-display text-3xl font-bold text-foreground">
                      {country.name}
                    </h2>
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {country.rating}
                    </Badge>
                  </div>
                  {city && (
                    <Badge variant="outline" className="w-fit mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {city.name}
                    </Badge>
                  )}
                  <p className="text-muted-foreground leading-relaxed">
                    {country.cun_des}
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Results Tabs */}
        <Tabs defaultValue="hotels" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="hotels" className="gap-2">
              <HotelIcon className="h-4 w-4" />
              Hotels ({hotels.length})
            </TabsTrigger>
            <TabsTrigger value="flights" className="gap-2">
              <Plane className="h-4 w-4" />
              Flights ({flights.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotels" className="space-y-6">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Available Hotels
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="flights" className="space-y-6">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Available Flights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
