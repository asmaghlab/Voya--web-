import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../routes/store";
import Globe, { GlobeMethods } from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, MapPin, Calendar, Clock, Award,
  Hotel, Star, Users, Bed, X, RotateCw, Navigation,
  Eye, EyeOff, Filter, Home, Globe as GlobeIcon,
  ChevronRight, Building, Wallet, CheckCircle, AlertCircle
} from 'lucide-react';

interface FlightBooking {
  id: string;
  from: string;
  to: string;
  date: string;
  airline: string;
  type: string;
  payment?: string;
  tickets?: number;
  lat?: number;
  lng?: number;
  toLat?: number;
  toLng?: number;
}

interface HotelBooking {
  id: string;
  hotelId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  hotel?: Hotel;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  lat?: number;
  lng?: number;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  altitude: number;
  stroke: number;
  flight: FlightBooking;
}

interface CityCoordinates {
  [key: string]: { lat: number; lng: number };
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

const cityCoordinates: CityCoordinates = {
  'Cairo, Egypt': { lat: 30.0444, lng: 31.2357 },
  'Dubai, United Arab Emirates': { lat: 25.2048, lng: 55.2708 },
  'Muscat, Oman': { lat: 23.5880, lng: 58.3829 },
  'Amman, Jordan': { lat: 31.9454, lng: 35.9284 },
  'Riyadh, Saudi Arabia': { lat: 24.7136, lng: 46.6753 },
  'Stockholm, Sweden': { lat: 59.3293, lng: 18.0686 },
  'Zurich, Switzerland': { lat: 47.3769, lng: 8.5417 },
  'Beirut, Lebanon': { lat: 33.8938, lng: 35.5018 },
  'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
  'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
  'Toronto, Canada': { lat: 43.6532, lng: -79.3832 },
  'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
  'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
  'Istanbul, Turkey': { lat: 41.0082, lng: 28.9784 },
  'Rio de Janeiro, Brazil': { lat: -22.9068, lng: -43.1729 },
  'New York, United States': { lat: 40.7128, lng: -74.0060 },
  'Kuwait City, Kuwait': { lat: 29.3759, lng: 47.9774 },
  'Hanoi, Vietnam': { lat: 21.0285, lng: 105.8542 },
  'Lahore, Pakistan': { lat: 31.5204, lng: 74.3587 }
};

const getCityCoordinates = (city: string): { lat: number; lng: number } | undefined => {
  return cityCoordinates[city] || undefined;
};

export default function TravelDashboard3D() {
  const user = useSelector((state: RootState) => state.auth.user) as AuthUser | null;
  const [flights, setFlights] = useState<FlightBooking[]>([]);
  const [hotels, setHotels] = useState<HotelBooking[]>([]);
  const [availableHotels, setAvailableHotels] = useState<Hotel[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightBooking | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelBooking | null>(null);
  const [hoveredFlight, setHoveredFlight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [globeRef, setGlobeRef] = useState<GlobeMethods | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showFlights, setShowFlights] = useState(true);
  const [showHotels, setShowHotels] = useState(true);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });
  const globeContainerRef = useRef<HTMLDivElement>(null);

  // Update globe size based on container
  useEffect(() => {
    const updateGlobeSize = () => {
      if (globeContainerRef.current) {
        const { clientWidth, clientHeight } = globeContainerRef.current;
        setGlobeSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateGlobeSize();
    window.addEventListener('resize', updateGlobeSize);
    return () => window.removeEventListener('resize', updateGlobeSize);
  }, []);

  // Fetch flights data
  useEffect(() => {
    if (!user?.email) return;
    
    const fetchFlights = async () => {
      try {
        const response = await fetch(`https://692b1d9e7615a15ff24ec4d9.mockapi.io/flightbooking?email=${user.email}`);
        const data: FlightBooking[] = await response.json();
        
        const enrichedData = data.map(f => ({
          ...f,
          lat: getCityCoordinates(f.from)?.lat || -60 + Math.random() * 120,
          lng: getCityCoordinates(f.from)?.lng || -180 + Math.random() * 360,
          toLat: getCityCoordinates(f.to)?.lat || -60 + Math.random() * 120,
          toLng: getCityCoordinates(f.to)?.lng || -180 + Math.random() * 360
        }));
        
        setFlights(enrichedData);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };
    
    fetchFlights();
  }, [user]);

  // Fetch hotel bookings
  useEffect(() => {
    if (!user?.email) return;
    
    const fetchHotels = async () => {
      try {
        const response = await fetch(`https://69287bd0b35b4ffc5015daf4.mockapi.io/bookings/hotelbooking?userId=${user.email}`);
        const bookings: HotelBooking[] = await response.json();
        
        const hotelsWithDetails = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const hotelRes = await fetch(`https://6934ceba4090fe3bf020c412.mockapi.io/api/v1/hotels/${booking.hotelId}`);
              const hotelData = await hotelRes.json();
              return {
                ...booking,
                hotel: {
                  ...hotelData,
                  lat: getCityCoordinates(hotelData.city)?.lat || -60 + Math.random() * 120,
                  lng: getCityCoordinates(hotelData.city)?.lng || -180 + Math.random() * 360
                }
              };
            } catch (error) {
              console.error('Error fetching hotel details:', error);
              return booking;
            }
          })
        );
        
        setHotels(hotelsWithDetails);
      } catch (error) {
        console.error('Error fetching hotel bookings:', error);
      }
    };
    
    fetchHotels();
  }, [user]);

  // Fetch available hotels
  useEffect(() => {
    const fetchAvailableHotels = async () => {
      try {
        const response = await fetch('https://6934ceba4090fe3bf020c412.mockapi.io/api/v1/hotels');
        const data: Hotel[] = await response.json();
        
        const enrichedData = data.map(hotel => ({
          ...hotel,
          lat: getCityCoordinates(hotel.city)?.lat || -60 + Math.random() * 120,
          lng: getCityCoordinates(hotel.city)?.lng || -180 + Math.random() * 360
        }));
        
        setAvailableHotels(enrichedData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    
    fetchAvailableHotels();
  }, []);

  // Handle globe auto-rotation
  useEffect(() => {
    if (globeRef && isGlobeReady) {
      const controls = globeRef.controls();
      if (controls) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.2;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.minDistance = 200;
        controls.maxDistance = 500;
      }
    }
  }, [globeRef, autoRotate, isGlobeReady]);

  const stats = useMemo(() => {
    const totalFlights = flights.length;
    const paidFlights = flights.filter(f => f.payment === 'paid').length;
    const upcomingFlights = flights.filter(f => new Date(f.date) > new Date()).length;
    const flightCities = new Set(flights.flatMap(f => [f.from, f.to])).size;
    
    const totalHotels = hotels.length;
    const confirmedHotels = hotels.filter(h => h.status === 'confirmed').length;
    const upcomingHotels = hotels.filter(h => new Date(h.checkIn) > new Date()).length;
    
    return { 
      totalFlights, 
      paidFlights, 
      upcomingFlights, 
      flightCities,
      totalHotels,
      confirmedHotels,
      upcomingHotels
    };
  }, [flights, hotels]);

  const arcsData = useMemo(() => {
    if (!showFlights) return [];
    return flights.map(f => ({
      startLat: f.lat || 0,
      startLng: f.lng || 0,
      endLat: f.toLat || 0,
      endLng: f.toLng || 0,
      color: hoveredFlight === f.id ? ['#f59e0b', '#d97706'] : ['#fbbf24', '#f59e0b'],
      altitude: hoveredFlight === f.id ? 0.4 : 0.25,
      stroke: hoveredFlight === f.id ? 3 : 1.8,
      flight: f
    } as ArcData));
  }, [flights, hoveredFlight, showFlights]);

  const handleArcClick = (arc: ArcData) => {
    setSelectedFlight(arc.flight);
  };

  const handleGlobeReady = () => {
    setIsGlobeReady(true);
    if (globeRef) {
      setTimeout(() => {
        globeRef.pointOfView({ lat: 0, lng: 0, altitude: 2.0 }, 0);
        
        const scene = globeRef.scene();
        if (scene) {
          scene.background = null;
          scene.fog = null;
        }
        
        if (globeRef.controls()) {
          globeRef.controls().autoRotate = autoRotate;
          globeRef.controls().autoRotateSpeed = 0.2;
        }
      }, 100);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return <CheckCircle size={14} className="text-emerald-400" />;
      case 'pending':
        return <AlertCircle size={14} className="text-amber-400" />;
      default:
        return <AlertCircle size={14} className="text-slate-400" />;
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const resetGlobeView = () => {
    if (globeRef) {
      globeRef.pointOfView({ lat: 0, lng: 0, altitude: 2.0 }, 1000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center rounded-3xl p-8 shadow-2xl max-w-md w-full border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center">
            <Plane size={40} className="text-gray-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Travel Dashboard</h2>
          <p className="text-gray-600 mb-6">Please login to view your travel information</p>
          <button className="w-full py-3 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="max-w-[1800px] mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('flights')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'flights' 
                  ? ' bg-[#0891b2] text-white shadow-lg' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Plane size={18} />
                <span className="text-sm font-medium">Flights</span>
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'hotels' 
                  ? 'bg-[#0891b2] text-white shadow-lg' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Hotel size={18} />
                <span className="text-sm font-medium">Hotels</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Trips</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalFlights}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                <Plane size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600">{stats.paidFlights} confirmed</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.upcomingFlights + stats.upcomingHotels}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-md">
                <Calendar size={24} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-gray-600">Flights & Hotels</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hotel Stays</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalHotels}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md">
                <Hotel size={24} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600">{stats.confirmedHotels} confirmed</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cities</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.flightCities}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md">
                <MapPin size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span className="text-gray-600">Around world</span>
            </div>
          </div>
        </div>

        {/* Main Content - Globe Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Globe Container - Full Height & Width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl h-full">
              <div className="p-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0891b2] flex items-center justify-center shadow-md">
                        <GlobeIcon size={20} className="text-white" />
                      </div>
                      <span className="bg-[#0891b2] bg-clip-text text-transparent">3D Interactive Globe</span>
                    </h2>
                    
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFlights(!showFlights)}
                      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                        showFlights 
                        ? 'bg-[#0891b2] text-white shadow-md' 
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {showFlights ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-sm font-medium">Flights</span>
                    </button>
                    <button
                      onClick={() => setShowHotels(!showHotels)}
                      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                        showHotels 
                        ? 'bg-[#0891b2] text-white shadow-md' 
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {showHotels ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-sm font-medium">Hotels</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Globe Area - بدون خلفية */}
              <div 
                ref={globeContainerRef}
                className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]"
              >
                {!isGlobeReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-gray-300 animate-spin"></div>
                      <p className="text-gray-700 font-medium">Initializing 3D Globe...</p>
                      <p className="text-gray-500 text-sm mt-1">Please wait</p>
                    </div>
                  </div>
                )}
                
                <Globe
                //   ref={setGlobeRef}
                  onGlobeReady={handleGlobeReady}
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  backgroundImageUrl={null}
                  arcsData={arcsData}
                  arcColor="color"
                  arcAltitude="altitude"
                  arcStroke="stroke"
                  arcDashLength={0.6}
                  arcDashGap={0.3}
                  arcDashAnimateTime={4000}
                  arcsTransitionDuration={2000}
                  onArcClick={handleArcClick}
                  onArcHover={(arc: ArcData | null) => setHoveredFlight(arc?.flight?.id || null)}
                  atmosphereColor="#06b6d4"
                  atmosphereAltitude={0.2}
                //   atmosphereOpacity={0.8}
                  width={globeSize.width}
                  height={globeSize.height}
                  animateIn={true}
                  waitForGlobeReady={false}
                  enablePointerInteraction={true}
                />

                {/* Hotel Points */}
                {showHotels && hotels.map(hotel => (
                  hotel.hotel?.lat && hotel.hotel.lng && (
                    <div key={`hotel-${hotel.id}`} className="absolute top-0 left-0 pointer-events-none">
                      <div
                        className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl transform -translate-x-1/2 -translate-y-1/2 opacity-90 hover:opacity-100 animate-pulse"
                        style={{
                          left: `${((hotel.hotel.lng + 180) / 360) * 100}%`,
                          top: `${((90 - hotel.hotel.lat) / 180) * 100}%`
                        }}
                      />
                    </div>
                  )
                ))}

                {/* Hover Info */}
                <AnimatePresence>
                  {hoveredFlight && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-6 left-6 bg-white rounded-xl shadow-2xl p-4 border border-gray-300 max-w-xs pointer-events-auto z-10"
                    >
                      {(() => {
                        const flight = flights.find(f => f.id === hoveredFlight);
                        if (!flight) return null;
                        return (
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <Plane size={18} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">
                                  {flight.from} → {flight.to}
                                </p>
                                <p className="text-sm text-gray-600">{flight.airline}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                {new Date(flight.date).toLocaleDateString()}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${flight.payment === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {flight.payment === 'paid' ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Globe Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-4">
                  <button
                    onClick={resetGlobeView}
                    className="w-14 h-14 rounded-full bg-white border border-gray-300 shadow-2xl flex items-center justify-center hover:bg-gray-50 hover:shadow-2xl transition-all hover:scale-105"
                    title="Reset View to Center"
                  >
                    <Home size={22} className="text-gray-700" />
                  </button>
                  <button
                    onClick={toggleAutoRotate}
                    className={`w-14 h-14 rounded-full border shadow-2xl flex items-center justify-center transition-all hover:scale-105 ${
                      autoRotate 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    title={autoRotate ? 'Stop Rotation' : 'Start Rotation'}
                  >
                    <RotateCw size={22} className={autoRotate ? 'animate-spin' : ''} />
                  </button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-white rounded-xl p-4 border border-gray-300 shadow-2xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Map Legend</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-md"></div>
                      <span className="text-sm text-gray-700">Flight Routes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse shadow-md"></div>
                      <span className="text-sm text-gray-700">Hotel Locations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Sidebar */}
          <div className="space-y-6">
            {/* Active Bookings Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeTab === 'flights' ? 'Flight Bookings' : 'Hotel Reservations'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your upcoming trips</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-gray-50 transition">
                    <Filter size={18} className="text-gray-600" />
                  </button>
                  <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
                    {activeTab === 'flights' ? flights.length : hotels.length}
                  </span>
                </div>
              </div>
              
              <div className="max-h-[650px] overflow-y-auto pr-2">
                {activeTab === 'flights' ? (
                  flights.length > 0 ? (
                    flights
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((flight) => (
                        <motion.div
                          key={flight.id}
                          whileHover={{ x: 5 }}
                          onHoverStart={() => setHoveredFlight(flight.id)}
                          onHoverEnd={() => setHoveredFlight(null)}
                          onClick={() => setSelectedFlight(flight)}
                          className="p-4 rounded-xl border border-gray-300 hover:border-blue-400 cursor-pointer transition-all hover:bg-blue-50 mb-4 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Plane size={16} className="text-blue-600" />
                                <p className="font-semibold text-gray-900 text-base truncate">
                                  {flight.from} → {flight.to}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{flight.airline}</p>
                            </div>
                            <span className={`text-xs px-3 py-1.5 rounded-full flex-shrink-0 ml-2 ${getStatusColor(flight.payment || 'pending')}`}>
                              {flight.payment === 'paid' ? 'Confirmed' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={14} />
                              <span>
                                {new Date(flight.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-gray-500" />
                              <span className="text-sm text-gray-600">{flight.tickets || 1} pax</span>
                            </div>
                          </div>

                          {new Date(flight.date) > new Date() && (
                            <div className="mt-4 pt-4 border-t border-gray-300">
                              <CountdownCompact date={flight.date} />
                            </div>
                          )}
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center">
                        <Plane size={32} className="text-blue-600" />
                      </div>
                      <p className="text-gray-700 font-medium text-lg">No flights booked yet</p>
                      <p className="text-gray-500 text-sm mt-2">Your flight bookings will appear here</p>
                    </div>
                  )
                ) : (
                  hotels.length > 0 ? (
                    hotels
                      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                      .map((hotel) => (
                        <motion.div
                          key={hotel.id}
                          whileHover={{ x: 5 }}
                          onClick={() => setSelectedHotel(hotel)}
                          className="p-4 rounded-xl border border-gray-300 hover:border-emerald-400 cursor-pointer transition-all hover:bg-emerald-50 mb-4 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Hotel size={16} className="text-emerald-600" />
                                <p className="font-semibold text-gray-900 text-base truncate">
                                  {hotel.hotel?.name || 'Hotel Booking'}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {hotel.hotel?.city || hotel.hotel?.location || 'Unknown Location'}
                              </p>
                            </div>
                            <span className={`text-xs px-3 py-1.5 rounded-full flex-shrink-0 ml-2 ${getStatusColor(hotel.status)}`}>
                              {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={14} />
                              <span className="truncate">
                                {new Date(hotel.checkIn).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Bed size={14} />
                              <span>{hotel.rooms} room{hotel.rooms > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          
                          {hotel.hotel?.rating && (
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.floor(hotel.hotel!.rating) 
                                      ? "fill-amber-400 text-amber-400" 
                                      : "fill-gray-300 text-gray-300"
                                    }
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">{hotel.hotel.rating}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                ${hotel.totalPrice}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center">
                        <Hotel size={32} className="text-emerald-600" />
                      </div>
                      <p className="text-gray-700 font-medium text-lg">No hotel bookings yet</p>
                      <p className="text-gray-500 text-sm mt-2">Your hotel stays will appear here</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recommended Hotels */}
            {availableHotels.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recommended Stays</h3>
                    <p className="text-sm text-gray-600 mt-1">Top hotels for your next trip</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                    {availableHotels.length} options
                  </span>
                </div>
                <div className="space-y-4">
                  {availableHotels.map((hotel) => (
                    <div key={hotel.id} className="p-3 rounded-xl border border-gray-300 hover:border-emerald-400 transition-all hover:bg-emerald-50 group">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                          {hotel.imageUrl ? (
                            <img 
                              src={hotel.imageUrl} 
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Hotel size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{hotel.name}</p>
                          <p className="text-xs text-gray-600 mt-1 truncate">{hotel.city}, {hotel.country}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium text-gray-900">{hotel.rating}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900">
                              ${hotel.pricePerNight}<span className="text-gray-500 text-xs font-normal">/night</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flight Detail Modal */}
      <AnimatePresence>
        {selectedFlight && (
          <FlightDetailModal 
            flight={selectedFlight} 
            onClose={() => setSelectedFlight(null)} 
          />
        )}
      </AnimatePresence>

      {/* Hotel Detail Modal */}
      <AnimatePresence>
        {selectedHotel && selectedHotel.hotel && (
          <HotelDetailModal 
            hotel={selectedHotel} 
            onClose={() => setSelectedHotel(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FlightDetailModal({ flight, onClose }: { flight: FlightBooking, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#0891b2] flex items-center justify-center">
                <Plane size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                  {flight.from} → {flight.to}
                </h2>
                <p className="text-black font-medium">{flight.airline}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Departure Date</span>
            <span className="font-semibold text-gray-900 text-right">
              {new Date(flight.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Travel Class</span>
            <span className="font-semibold text-gray-900 capitalize">{flight.type}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Passengers</span>
            <span className="font-semibold text-gray-900">
              {flight.tickets || 1} {flight.tickets === 1 ? 'person' : 'people'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Booking Status</span>
            <span className={`font-semibold ${flight.payment === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {flight.payment === 'paid' ? '✓ Confirmed & Paid' : '⏳ Pending Payment'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-mono text-sm font-semibold ">
              {flight.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {new Date(flight.date) > new Date() && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0891b2] flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <span className="text-lg font-semibold text-gray-900">Time Until Departure</span>
            </div>
            <CountdownDisplay date={flight.date} />
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-semibold bg-[#0891b2] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Close Details
        </button>
      </motion.div>
    </motion.div>
  );
}

function HotelDetailModal({ hotel, onClose }: { hotel: HotelBooking, onClose: () => void }) {
  if (!hotel.hotel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Hotel size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{hotel.hotel.name}</h2>
                <p className="text-emerald-600">{hotel.hotel.city}, {hotel.hotel.country}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {hotel.hotel.imageUrl && (
          <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden border border-gray-300">
            <img 
              src={hotel.hotel.imageUrl} 
              alt={hotel.hotel.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={20} className="fill-amber-400 text-amber-400" />
              <span className="text-lg font-bold text-gray-900">{hotel.hotel.rating}/5</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              ${hotel.totalPrice}<span className="text-gray-500 text-sm font-normal ml-1">total</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Check-in</span>
              </div>
              <p className="text-sm text-gray-700">
                {new Date(hotel.checkIn).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-emerald-600" />
                <span className="text-sm font-medium text-gray-900">Check-out</span>
              </div>
              <p className="text-sm text-gray-700">
                {new Date(hotel.checkOut).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Guests</span>
            <span className="font-semibold text-gray-900">
              {hotel.guests} {hotel.guests === 1 ? 'guest' : 'guests'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Rooms</span>
            <span className="font-semibold text-gray-900">
              {hotel.rooms} {hotel.rooms === 1 ? 'room' : 'rooms'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-gray-600">Booking Status</span>
            <span className={`font-semibold ${hotel.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {hotel.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-mono text-sm font-semibold text-emerald-600">
              {hotel.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {hotel.hotel.amenities && hotel.hotel.amenities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.hotel.amenities.slice(0, 6).map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-900 to-teal-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Close Details
        </button>
      </motion.div>
    </motion.div>
  );
}

function CountdownDisplay({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(date).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Departed');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-gray-900 font-mono">
        {timeLeft || 'Calculating...'}
      </p>
    </div>
  );
}

function CountdownCompact({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(date).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        setTimeLeft(`${days}d ${hours}h`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [date]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <Clock size={12} />
      <span className="font-medium">
        {timeLeft} left
      </span>
    </div>
  );
}