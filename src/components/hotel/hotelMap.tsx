import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IHotel } from "@/features/hotels/types";
import HotelMapCard from "./hotelMapCard";

// Create custom price icon
const createPriceIcon = (price: number) =>
  L.divIcon({
    html: `
      <div class="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg">
        $${price}
      </div>
    `,
    className: "",
    iconSize: [50, 30],
    iconAnchor: [25, 15],
  });

export default function HotelMap({
  hotel,
  loading,
}: {
  hotel: IHotel[];
  loading: boolean;
}) {
  const bounds = useMemo(() => {
    const hotelsWithCoords = hotel.filter(
      (h) => h.lat !== undefined && h.lng !== undefined
    );
    if (hotelsWithCoords.length === 0) return undefined;

    const latLngs = hotelsWithCoords.map(
      (h) => [h.lat!, h.lng!] as [number, number]
    );
    return L.latLngBounds(latLngs);
  }, [hotel]);
  if (loading)
    return <p className="text-center text-lg font-medium py-6">Loading...</p>;

  return (
    <div className="w-full h-[80vh] md:h-screen rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        // center={center}
        bounds={bounds}
        zoom={10}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {hotel.map((hotel) =>
          hotel.lat !== undefined && hotel.lng !== undefined ? (
            <Marker
              key={hotel.id}
              position={[hotel.lat, hotel.lng]}
              icon={createPriceIcon(hotel.pricePerNight || 0)}
              eventHandlers={{
                click: () => {
                  const card = document.getElementById(`hotel-${hotel.id}`);
                  if (card) {
                    card.scrollIntoView({ behavior: "smooth", block: "start" });
                    card.classList.add("ring-4", "ring-blue-500");

                    setTimeout(() => {
                      card.classList.remove("ring-4", "ring-blue-500");
                    }, 1200);
                  }
                },
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  e.target.closePopup();
                },
              }}
            >
              <Popup>
                <HotelMapCard hotel={hotel} />
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
