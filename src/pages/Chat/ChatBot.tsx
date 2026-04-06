import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, Hotel, Plane, ChevronLeft, Sparkles,
  MapPin, Calendar, Users, DollarSign, Minimize2, Maximize2, RefreshCw,
  Bot, Star, Clock, Check, Navigation, ExternalLink, Building,
  Wifi, Coffee, Utensils, CreditCard as CreditCardIcon,
  Briefcase, Luggage, Compass, Award,
  Globe, TrendingUp, Heart, User as UserIcon, Smile
} from 'lucide-react';
import OpenAI from 'openai';
import { useAppSelector, useAppDispatch } from '@/routes/hooks';
import { createFlightBooking } from '@/features/booking/flightBookingSlice';
import { createHotelBooking } from '@/features/booking/hotelBookingSlice';

// ============= TYPES =============
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  options?: string[];
  isQuestion?: boolean;
  isResult?: boolean;
}

interface UserPreferences {
  destination?: string;
  budget?: string;
  duration?: string;
  season?: string;
  travelers?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  tickets?: number;
}

interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  stars: number;
  country?: string;
  city?: string;
  amenities: string[];
  offers: string[];
  reviewCount?: number;
  image?: string;
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
  phone?: string;
  website?: string;
  currency?: string;
  propertyType?: string;
  distanceFromCenter?: string;
  checkIn?: string;
  checkOut?: string;
  description?: string;
  address?: string;
}

interface Flight {
  id: number;
  airline: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  offer: string;
  type?: string;
  departureTime?: string;
  arrivalTime?: string;
  stops?: number;
  passenger?: number;
}

interface Country {
  id: string;
  name: string;
  code: string;
  capital: string;
  region: string;
  population?: string;
  language?: string;
  currency?: string;
  bestTimeToVisit?: string;
  cun_des?: string;
  image?: string;
  rating?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIQuestionResponse {
  question: string;
  options: string[];
}

interface CountryApiResponse {
  name: {
    common: string;
  };
  cca2: string;
  capital?: string[];
  region: string;
  population?: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
}

interface CacheItem {
  data: unknown;
  timestamp: number;
}

interface BookingFormData {
  // Flight Booking
  from?: string;
  to?: string;
  date?: string;
  type?: string;
  tickets?: number;
  price?: number;
  airline?: string;
  duration?: string;

  // Hotel Booking
  hotelId?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  guest?: number;
  hotelType?: string;
  pricePerNight?: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateUserProfileData {
  name?: string;
  phone?: string;
  country?: string;
  avatar?: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

// ============= API SERVICE =============
class APIService {
  private static instance: APIService;
  private cache: Map<string, CacheItem> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000;

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): unknown {
    const cached = this.cache.get(key);
    return cached?.data;
  }

  async fetchCountries(): Promise<Country[]> {
    const cacheKey = 'countries';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey) as Country[];
    }

    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,population,languages,currencies');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CountryApiResponse[] = await response.json();

      const countries: Country[] = data.map((country) => ({
        id: country.cca2.toLowerCase(),
        name: country.name.common,
        code: country.cca2,
        capital: country.capital?.[0] || 'Not specified',
        region: country.region || 'Not specified',
        population: country.population ? country.population.toLocaleString() : 'Unknown',
        language: country.languages ? Object.values(country.languages)[0] : 'Not specified',
        currency: country.currencies ? Object.keys(country.currencies)[0] : 'Not specified',
        rating: 4 + Math.random(),
        image: `https://picsum.photos/seed/${country.cca2}/400/300.jpg`,
        bestTimeToVisit: this.getBestTimeToVisit(country.region),
        cun_des: `Discover the beautiful ${country.name.common}, located in ${country.region}.`
      })).filter((country) =>
        country.name && country.code &&
        !['Antarctica', 'Vatican City', 'San Marino'].includes(country.name)
      );

      this.setCache(cacheKey, countries);
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return this.getFallbackCountries();
    }
  }

  private getBestTimeToVisit(region: string): string {
    const seasons: Record<string, string> = {
      'Europe': 'April - October',
      'Americas': 'Year-round',
      'Asia': 'October - April',
      'Africa': 'June - September',
      'Oceania': 'December - March'
    };
    return seasons[region] || 'Year-round';
  }

  async fetchHotels(destination: string, budget?: string): Promise<Hotel[]> {
    const cacheKey = `hotels_${destination}_${budget || 'default'}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey) as Hotel[];
    }

    try {
      const hotels = await this.generateRealisticHotels(destination, budget);
      this.setCache(cacheKey, hotels);
      return hotels;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return this.getFallbackHotels(destination);
    }
  }

  async fetchFlights(from: string, to: string, budget?: string): Promise<Flight[]> {
    const cacheKey = `flights_${from}_${to}_${budget || 'default'}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey) as Flight[];
    }

    try {
      const flights = await this.generateRealisticFlights(from, to, budget);
      this.setCache(cacheKey, flights);
      return flights;
    } catch (error) {
      console.error('Error fetching flights:', error);
      return this.getFallbackFlights(from, to);
    }
  }

  private async generateRealisticHotels(destination: string, budget?: string): Promise<Hotel[]> {
    const hotelChains = [
      'Marriott', 'Hilton', 'Hyatt', 'InterContinental', 'Sheraton',
      'Westin', 'Radisson', 'Holiday Inn', 'Best Western', 'Accor',
      'Four Seasons', 'Ritz-Carlton', 'W Hotels', 'St. Regis', 'Mandarin Oriental'
    ];

    const amenities = ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'Pet-friendly', 'Airport Shuttle', 'Business Center'];
    const offers = [
      'Free breakfast', '10% off 3+ nights', 'Late checkout',
      'Free cancellation', 'Room upgrade', 'Spa credit', 'Airport transfer',
      'Welcome drink', 'Early check-in', 'Dining credit'
    ];

    const priceRange = this.getBudgetRange(budget);
    const hotels: Hotel[] = [];

    for (let i = 0; i < 6; i++) {
      const chain = hotelChains[Math.floor(Math.random() * hotelChains.length)];
      const price = Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min);
      const rating = (Math.random() * 2 + 3).toFixed(1);
      const stars = Math.floor(Math.random() * 3) + 3;
      const city = destination.split(',')[0]?.trim() || destination;

      hotels.push({
        id: `hotel_${Date.now()}_${i}`,
        name: `${chain} ${city}`,
        pricePerNight: price,
        rating: parseFloat(rating),
        stars,
        country: destination.toLowerCase().includes('united states') ? 'USA' : destination,
        city: city,
        amenities: this.getRandomItems(amenities, Math.floor(Math.random() * 3) + 3),
        offers: this.getRandomItems(offers, Math.floor(Math.random() * 2) + 1),
        reviewCount: Math.floor(Math.random() * 2000 + 500),
        image: `https://picsum.photos/seed/hotel${i}/400/300.jpg`,
        freeCancellation: Math.random() > 0.5,
        breakfastIncluded: Math.random() > 0.3,
        currency: 'USD',
        propertyType: ['Hotel', 'Resort', 'Boutique', 'Luxury'][Math.floor(Math.random() * 4)] as Hotel['propertyType'],
        distanceFromCenter: `${(Math.random() * 10 + 1).toFixed(1)} km`,
        checkIn: '14:00',
        checkOut: '12:00',
        description: `Beautiful ${['hotel', 'resort', 'property'][Math.floor(Math.random() * 3)]} located in the heart of ${city} with amazing amenities and services.`,
        address: `${Math.floor(Math.random() * 1000) + 1} Main Street, ${city}`
      });
    }

    return hotels.sort((a, b) => b.rating - a.rating);
  }

  private async generateRealisticFlights(from: string, to: string, budget?: string): Promise<Flight[]> {
    const airlines = [
      'Emirates', 'Qatar Airways', 'Turkish Airlines', 'Lufthansa',
      'British Airways', 'Air France', 'KLM', 'Etihad', 'Gulf Air',
      'Delta', 'United', 'American Airlines', 'Singapore Airlines', 'Cathay Pacific'
    ];

    const priceRange = this.getBudgetRange(budget);
    const flights: Flight[] = [];

    for (let i = 0; i < 6; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const price = Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min);
      const hours = Math.floor(Math.random() * 8 + 2);
      const minutes = Math.floor(Math.random() * 60);
      const stops = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;

      flights.push({
        id: i + 1,
        airline,
        from: from || 'Cairo',
        to: to || 'London',
        price,
        duration: `${hours}h ${minutes}m`,
        offer: Math.random() > 0.6 ? `${Math.floor(Math.random() * 30 + 5)}% off` : 'No offer',
        type: ['economy', 'premium', 'business'][Math.floor(Math.random() * 3)] as Flight['type'],
        departureTime: `${Math.floor(Math.random() * 12 + 6).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        arrivalTime: `${Math.floor(Math.random() * 12 + 14).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        stops,
        passenger: Math.floor(Math.random() * 2) + 1
      });
    }

    return flights.sort((a, b) => a.price - b.price);
  }

  private getBudgetRange(budget?: string): { min: number; max: number } {
    if (!budget) return { min: 50, max: 500 };

    if (budget.includes('Under $100') || budget.includes('💵')) return { min: 30, max: 100 };
    if (budget.includes('$100-$250') || budget.includes('💳')) return { min: 80, max: 250 };
    if (budget.includes('$250-$400') || budget.includes('💎')) return { min: 200, max: 400 };
    if (budget.includes('$400+') || budget.includes('👑')) return { min: 350, max: 800 };

    return { min: 50, max: 500 };
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private getFallbackCountries(): Country[] {
    return [
      {
        id: 'us',
        name: 'United States',
        code: 'US',
        capital: 'Washington D.C.',
        region: 'Americas',
        population: '331 million',
        language: 'English',
        currency: 'USD',
        rating: 4.5,
        bestTimeToVisit: 'April - October',
        image: 'https://picsum.photos/seed/us/400/300.jpg',
        cun_des: 'Discover the diverse landscapes and vibrant cities of the United States.'
      },
      {
        id: 'gb',
        name: 'United Kingdom',
        code: 'GB',
        capital: 'London',
        region: 'Europe',
        population: '67 million',
        language: 'English',
        currency: 'GBP',
        rating: 4.6,
        bestTimeToVisit: 'May - September',
        image: 'https://picsum.photos/seed/gb/400/300.jpg',
        cun_des: 'Experience the rich history and culture of the United Kingdom.'
      },
      {
        id: 'fr',
        name: 'France',
        code: 'FR',
        capital: 'Paris',
        region: 'Europe',
        population: '67 million',
        language: 'French',
        currency: 'EUR',
        rating: 4.7,
        bestTimeToVisit: 'April - June, September - October',
        image: 'https://picsum.photos/seed/fr/400/300.jpg',
        cun_des: 'Enjoy the romance, cuisine, and art of beautiful France.'
      }
    ];
  }

  private getFallbackHotels(destination: string): Hotel[] {
    const city = destination.split(',')[0]?.trim() || destination;
    return [
      {
        id: 'fallback_1',
        name: `Grand Hotel ${city}`,
        pricePerNight: 150,
        rating: 4.2,
        stars: 4,
        country: city === 'United States' ? 'USA' : destination,
        city: city,
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym'],
        offers: ['Free breakfast', 'Late checkout'],
        reviewCount: 1250,
        freeCancellation: true,
        breakfastIncluded: true,
        currency: 'USD',
        propertyType: 'Hotel',
        distanceFromCenter: '2.5 km',
        checkIn: '14:00',
        checkOut: '12:00',
        description: `A beautiful hotel located in the heart of ${city}.`
      }
    ];
  }

  private getFallbackFlights(from: string, to: string): Flight[] {
    return [
      {
        id: 1,
        airline: 'Global Airlines',
        from: from || 'Cairo',
        to: to || 'London',
        price: 450,
        duration: '3h 30m',
        offer: '10% off',
        departureTime: '10:30',
        arrivalTime: '14:00',
        stops: 0,
        type: 'economy',
        passenger: 1
      }
    ];
  }

  // API للمستخدمين
  async fetchUserProfile(email: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`https://692b1d9e7615a15ff24ec4d9.mockapi.io/users?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users: UserProfile[] = await response.json();
      return users[0] || null;
    } catch (error: unknown) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, userData: UpdateUserProfileData): Promise<UserProfile | null> {
    try {
      const response = await fetch(`https://692b1d9e7615a15ff24ec4d9.mockapi.io/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as UserProfile;
    } catch (error: unknown) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
}

// ============= AI SERVICE =============
class AIService {
  private client: OpenAI;
  private conversationHistory: ChatMessage[] = [];
  private userName: string = '';

  constructor(userName: string = '') {
    this.client = new OpenAI({
      apiKey: '', // Replace with your OpenAI API key
      dangerouslyAllowBrowser: true
    });
    this.userName = userName;
  }

  setUserName(name: string): void {
    this.userName = name;
  }

  async askQuestion(step: number, preferences: UserPreferences, countries: Country[]): Promise<AIQuestionResponse> {
    try {
      const userGreeting = this.userName ? `Hey ${this.userName}! ` : 'Hi! ';

      const questionPrompts = [
        {
          system: `You are a friendly travel assistant. User's name is ${this.userName || 'there'}. Use their name when talking to them. Ask about travel destination.`,
          user: `Ask where the user wants to travel. Available countries: ${countries.slice(0, 4).map(c => c.name).join(', ')}.
Respond with ONLY valid JSON (no markdown, no backticks):
{
  "question": "${userGreeting}🌍 Where would you like to travel?",
  "options": ["${countries[0]?.name || 'United States'}", "${countries[1]?.name || 'United Kingdom'}", "${countries[2]?.name || 'France'}", "Surprise me! 🎲"]
}`
        },
        {
          system: `Ask about accommodation budget. User's name is ${this.userName}. Use their name.`,
          user: `User chose destination: ${preferences.destination || 'Not specified'}. Ask about budget for accommodation.
Respond with ONLY valid JSON:
{
  "question": "${this.userName ? `Perfect choice, ${this.userName}! ` : 'Perfect choice! '}💰 What's your budget per night for accommodation?",
  "options": ["Under $100 💵", "$100-$250 💳", "$250-$400 💎", "$400+ 👑"]
}`
        },
        {
          system: `Ask about trip duration. User's name is ${this.userName}. Use their name.`,
          user: `User budget: ${preferences.budget || 'Not specified'}. Ask about number of nights for the trip.
Respond with ONLY valid JSON:
{
  "question": "${this.userName ? `Great, ${this.userName}! ` : 'Great! '}📅 How many nights are you planning to stay?",
  "options": ["2-3 nights", "4-5 nights", "6-7 nights", "1 week+"]
}`
        },
        {
          system: `Ask about number of travelers. User's name is ${this.userName}. Use their name.`,
          user: `User duration: ${preferences.duration || 'Not specified'}. Ask about number of travelers.
Respond with ONLY valid JSON:
{
  "question": "${this.userName ? `Awesome, ${this.userName}! ` : 'Awesome! '}👥 How many people are traveling?",
  "options": ["1 person", "2 people", "3-4 people", "5+ people"]
}`
        }
      ];

      const currentPrompt = step < questionPrompts.length ? questionPrompts[step] : questionPrompts[0];

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: currentPrompt.system },
          { role: "user", content: currentPrompt.user }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      let response = completion.choices[0]?.message?.content?.trim() || '';

      // تم إصلاح الـ regex هنا
      response = response.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as AIQuestionResponse;
        } catch (parseError: unknown) {
          console.error('JSON Parse Error:', parseError);
          return this.getFallbackQuestion(step, countries);
        }
      }

      return this.getFallbackQuestion(step, countries);

    } catch (error: unknown) {
      console.error('AI Error:', error);
      return this.getFallbackQuestion(step, countries);
    }
  }

  async searchRecommendations(
    preferences: UserPreferences,
    hotels: Hotel[],
    flights: Flight[]
  ): Promise<string> {
    try {
      const topHotels = hotels.slice(0, 3);
      const topFlights = flights.slice(0, 3);
      const userName = this.userName ? `, ${this.userName}` : '';

      const prompt = `Create personalized travel recommendations for ${userName || 'the user'}:

**User Preferences:**
🎯 Destination: ${preferences.destination || 'Not specified'}
💰 Budget: ${preferences.budget || 'Not specified'}
📅 Duration: ${preferences.duration || 'Not specified'}
👥 Travelers: ${preferences.travelers || 'Not specified'}

**Top Hotels (${topHotels.length}):**
 ${topHotels.map((h, i) => `
 ${i + 1}. ${h.name}
   💵 $${h.pricePerNight}/night
   ⭐ ${h.rating}/5
   🎁 ${h.offers[0] || 'Special offer'}
`).join('\n')}

**Top Flights (${topFlights.length}):**
 ${topFlights.map((f, i) => `
 ${i + 1}. ${f.airline}: ${f.from} → ${f.to}
   💵 $${f.price} | ⏱️ ${f.duration}
   ${f.offer !== 'No offer' ? `🎁 ${f.offer}` : ''}
`).join('\n')}

Write a warm, engaging recommendation. Use the user's name ${userName ? `(${this.userName})` : ''} and be enthusiastic! Use emojis. Keep under 200 characters.`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an enthusiastic travel expert. Be warm, helpful, and use emojis. Use the user's name if available." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      return completion.choices[0]?.message?.content || this.generateFallbackRecommendation(preferences, topHotels, topFlights);

    } catch (error: unknown) {
      console.error('AI Error:', error);
      return this.generateFallbackRecommendation(preferences, hotels, flights);
    }
  }

  async chat(message: string, preferences: UserPreferences): Promise<string> {
    try {
      this.conversationHistory.push({ role: "user", content: message });

      const systemMessage = `You are a helpful travel assistant. User's name is ${this.userName || 'there'}. User preferences: ${JSON.stringify(preferences)}. Keep responses under 80 characters. Use their name naturally when appropriate.`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          ...this.conversationHistory.slice(-3)
        ],
        temperature: 0.7,
        max_tokens: 80
      });

      const reply = completion.choices[0]?.message?.content || "I'm here to help!";
      this.conversationHistory.push({ role: "assistant", content: reply });

      return reply;

    } catch (error: unknown) {
      console.error('AI Error:', error);
      return "I'm here to help with your travel plans!";
    }
  }

  private getFallbackQuestion(step: number, countries: Country[]): AIQuestionResponse {
    const userGreeting = this.userName ? `Hey ${this.userName}! ` : 'Hi! ';

    const questions = [
      `${userGreeting}🌍 Where would you like to travel?`,
      `${this.userName ? `${this.userName}, ` : ''}What's your budget per night for accommodation? 💰`,
      `${this.userName ? `Great, ${this.userName}! ` : 'Great! '}📅 How many nights will you stay?`,
      `${this.userName ? `Awesome, ${this.userName}! ` : 'Awesome! '}👥 How many people are traveling?`
    ];

    const options = [
      [...countries.slice(0, 3).map(c => c.name), "Surprise me! 🎲"],
      ["Under $100 💵", "$100-$250 💳", "$250-$400 💎", "$400+ 👑"],
      ["2-3 nights", "4-5 nights", "6-7 nights", "1 week+"],
      ["1 person", "2 people", "3-4 people", "5+ people"]
    ];

    return {
      question: questions[step] || "Tell me about your travel plans!",
      options: options[step] || []
    };
  }

  private generateFallbackRecommendation(preferences: UserPreferences, hotels: Hotel[], flights: Flight[]): string {
    const dest = preferences.destination || 'your destination';
    const userName = this.userName ? `, ${this.userName}` : '';
    return `✨ Great choice for ${dest}${userName}! I found ${hotels.length} hotels and ${flights.length} flights. Let me show you the best options! 🏨✈️`;
  }

  async generatePersonalizedGreeting(): Promise<string> {
    if (!this.userName) {
      return "🌟 Welcome! I'm your AI travel assistant! 🌍✈️🏨";
    }

    try {
      const prompt = `Generate a warm, personalized greeting for ${this.userName}. Use their name naturally. Include travel emojis. Keep it under 50 characters.`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a friendly travel assistant. Be warm and use emojis." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 60
      });

      return completion.choices[0]?.message?.content || `🌟 Hey ${this.userName}! Welcome to your personal travel assistant! 🌍✈️`;

    } catch (error: unknown) {
      console.error('AI Greeting Error:', error);
      return `🌟 Hey ${this.userName}! Welcome to your travel assistant! 🌍`;
    }
  }
}

// ============= MAIN COMPONENT =============
const TravelAIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'chat' | 'hotels' | 'flights'>('chat');
  const [countries, setCountries] = useState<Country[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [randomCountries, setRandomCountries] = useState<Country[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBookingForm, setShowBookingForm] = useState<'hotel' | 'flight' | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({});
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiService = useRef<APIService>(APIService.getInstance());
  const aiService = useRef<AIService>(new AIService());

  // Redux hooks
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const { isLoading: flightBookingLoading } = useAppSelector((state) => state.flightBooking);
  const { isLoading: hotelBookingLoading } = useAppSelector((state) => state.hotelBooking);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLoggedIn && user) {
      // تحديث AI service باسم المستخدم
      aiService.current.setUserName(user.name);

      // جلب بيانات المستخدم من API
      fetchUserProfile();
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, viewMode, showBookingForm]);

  useEffect(() => {
    if (isOpen) {
      loadCountries();
    }
  }, [isOpen]);

  const fetchUserProfile = async (): Promise<void> => {
    if (!user?.email) return;

    try {
      const profile = await apiService.current.fetchUserProfile(user.email);
      if (profile) {
        setUserProfile(profile);
        console.log('User profile loaded:', profile);
      }
    } catch (error: unknown) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loadCountries = async (): Promise<void> => {
    try {
      setDataLoading(true);
      const countriesData = await apiService.current.fetchCountries();
      setCountries(countriesData);
      selectRandomCountries(countriesData);
    } catch (error: unknown) {
      console.error('Error loading countries:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const selectRandomCountries = (countriesList: Country[]): void => {
    const shuffled = [...countriesList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setRandomCountries(selected);
  };

  const loadDestinationData = async (): Promise<void> => {
    if (!preferences.destination) return;

    try {
      setDataLoading(true);
      const [hotelsData, flightsData] = await Promise.all([
        apiService.current.fetchHotels(preferences.destination, preferences.budget),
        apiService.current.fetchFlights('Cairo', preferences.destination, preferences.budget)
      ]);

      setHotels(hotelsData);
      setFlights(flightsData);
    } catch (error: unknown) {
      console.error('Error loading destination data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (preferences.destination) {
      loadDestinationData();
    }
  }, [preferences.destination, preferences.budget]);

  const initChat = async (): Promise<void> => {
    // تحضير الترحيب الشخصي
    let greeting = '';

    if (user?.name) {
      setLoading(true);
      greeting = await aiService.current.generatePersonalizedGreeting();
      setLoading(false);
    } else {
      greeting = "🌟 Welcome! I'm your AI travel assistant! 🌍✈️🏨";
    }

    addMessage('bot', greeting);

    setTimeout(async () => {
      setLoading(true);
      const data = await aiService.current.askQuestion(0, preferences, randomCountries);
      addMessage('bot', data.question, data.options);
      setStep(1);
      setLoading(false);
    }, 500);
  };

  const addMessage = (sender: 'user' | 'bot', text: string, options?: string[]): void => {
    const msg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      options
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleOptionClick = async (option: string): Promise<void> => {
    addMessage('user', option);

    if (step <= 4 && !showResults) {
      const keys: (keyof UserPreferences)[] = ['destination', 'budget', 'duration', 'travelers'];
      const key = keys[step - 1];

      const newPrefs = { ...preferences, [key]: option };
      setPreferences(newPrefs);

      if (step < 4) {
        setLoading(true);
        setTimeout(async () => {
          const data = await aiService.current.askQuestion(step, newPrefs, randomCountries);
          addMessage('bot', data.question, data.options);
          setStep(step + 1);
          setLoading(false);
        }, 200);
      } else {
        await searchRecommendations(newPrefs);
      }
    } else {
      handleAction(option);
    }
  };

  const searchRecommendations = async (prefs: UserPreferences): Promise<void> => {
    setLoading(true);
    addMessage('bot', `🔍 Searching for ${prefs.destination || 'your destination'}...`);

    const recommendations = await aiService.current.searchRecommendations(prefs, hotels, flights);

    addMessage('bot', recommendations, [
      '🏨 View Hotels',
      '✈️ View Flights',
      '🔄 New Search'
    ]);

    setShowResults(true);
    setLoading(false);
  };

  const handleAction = (action: string): void => {
    if (action.includes('Hotels') || action.includes('🏨')) {
      setViewMode('hotels');
    } else if (action.includes('Flights') || action.includes('✈️')) {
      setViewMode('flights');
    } else if (action.includes('New Search') || action.includes('🔄')) {
      resetChat();
    }
  };

  const handleSend = async (): Promise<void> => {
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');
    addMessage('user', text);

    setLoading(true);
    const reply = await aiService.current.chat(text, preferences);
    addMessage('bot', reply);
    setLoading(false);
  };

  const resetChat = (): void => {
    setMessages([]);
    setPreferences({});
    setStep(0);
    setShowResults(false);
    setViewMode('chat');
    setSelectedHotel(null);
    setSelectedFlight(null);
    setShowBookingForm(null);
    setBookingData({});
    selectRandomCountries(countries);
    setTimeout(() => initChat(), 300);
  };

  const refreshData = async (): Promise<void> => {
    setDataLoading(true);
    try {
      await loadCountries();
      if (preferences.destination) {
        await loadDestinationData();
      }
      addMessage('bot', '🔄 Data refreshed!');
    } catch (error: unknown) {
      addMessage('bot', '❌ Error refreshing data.');
    } finally {
      setDataLoading(false);
    }
  };

  const toggleMinimize = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMinimized(!isMinimized);
      setIsAnimating(false);
    }, 100);
  };

  const closeChat = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsMinimized(false);
      setIsAnimating(false);
    }, 200);
  };

  const handleBookHotel = async (hotel: Hotel): Promise<void> => {
    if (!user) {
      addMessage('bot', '❌ Please login to book a hotel.');
      return;
    }

    setSelectedHotel(hotel);
    setBookingData({
      hotelId: hotel.id,
      hotelName: hotel.name,
      pricePerNight: hotel.pricePerNight,
      guest: parseInt(preferences.travelers?.[0] || '1')
    });

    setShowBookingForm('hotel');
  };

  const handleBookFlight = async (flight: Flight): Promise<void> => {
    if (!user) {
      addMessage('bot', '❌ Please login to book a flight.');
      return;
    }

    setSelectedFlight(flight);
    setBookingData({
      from: flight.from,
      to: flight.to,
      type: flight.type,
      price: flight.price,
      airline: flight.airline,
      duration: flight.duration,
      tickets: parseInt(preferences.travelers?.[0] || '1')
    });

    setShowBookingForm('flight');
  };

  const submitBooking = async (): Promise<void> => {
    if (!showBookingForm || !user) return;

    setBookingLoading(true);

    try {
      if (showBookingForm === 'flight') {
        const flightBookingData = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          tickets: bookingData.tickets || 1,
          type: bookingData.type || 'economy',
          from: bookingData.from || '',
          to: bookingData.to || '',
          date: bookingData.date || new Date().toISOString().split('T')[0],
          airline: bookingData.airline || 'Unknown',
          payment: 'Credit Card',
          price: bookingData.price || 0
        };

        await dispatch(createFlightBooking(flightBookingData)).unwrap();

        // رسالة تأكيد شخصية
        addMessage('bot', `✅ Perfect, ${user.name}! Your flight has been booked successfully! ✈️ Check your bookings page for details.`);

      } else {
        const hotelBookingData = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          guest: bookingData.guest || 1,
          type: bookingData.hotelType || 'Standard',
          checkIn: bookingData.checkIn || new Date().toISOString().split('T')[0],
          checkOut: bookingData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
          hotelname: bookingData.hotelName || '',
          hotelId: bookingData.hotelId || '',
          totalPrice: (bookingData.pricePerNight || 0) * (bookingData.guest || 1),
          numberOfNights: Math.ceil(
            (new Date(bookingData.checkOut || Date.now() + 86400000).getTime() -
             new Date(bookingData.checkIn || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
          ),
          payment: 'Credit Card',
          paymentMethodId: 'chatbot_booking'
        };

        await dispatch(createHotelBooking(hotelBookingData)).unwrap();

        // رسالة تأكيد شخصية
        addMessage('bot', `✅ Excellent choice, ${user.name}! Your hotel has been booked successfully! 🏨 Check your bookings page for details.`);
      }

      setShowBookingForm(null);
      setSelectedHotel(null);
      setSelectedFlight(null);
      setViewMode('chat');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      addMessage('bot', `❌ Oops ${user?.name || 'there'}! Booking failed: ${errorMessage}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string): React.ReactNode => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="w-2.5 h-2.5" />;
    if (amenityLower.includes('pool')) return <Sparkles className="w-2.5 h-2.5" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Utensils className="w-2.5 h-2.5" />;
    if (amenityLower.includes('bar')) return <Coffee className="w-2.5 h-2.5" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <TrendingUp className="w-2.5 h-2.5" />;
    if (amenityLower.includes('spa')) return <Sparkles className="w-2.5 h-2.5" />;
    return <Check className="w-2.5 h-2.5" />;
  };

  const renderHotelDetailsModal = (): React.ReactNode => {
    if (!selectedHotel) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedHotel.name}</h3>
              <p className="text-gray-600 text-xs mt-0.5">
                {selectedHotel.city}, {selectedHotel.country}
              </p>
            </div>
            <button
              onClick={() => setSelectedHotel(null)}
              className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#00ace6] to-[#33bcff] flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-base">{selectedHotel.name}</h4>
                <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedHotel.address || `${selectedHotel.city}, ${selectedHotel.country}`}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Hotel Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Rating</span>
                    <span className="font-medium text-sm flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      {selectedHotel.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Category</span>
                    <span className="font-medium text-sm">
                      {selectedHotel.stars} stars • {selectedHotel.propertyType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Check-in/out</span>
                    <span className="font-medium text-sm">
                      {selectedHotel.checkIn || "14:00"} / {selectedHotel.checkOut || "12:00"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Price & Offers</h4>
                <div className="bg-gradient-to-r from-[#00ace6]/10 to-[#33bcff]/10 p-3 rounded-xl mb-3">
                  <div className="text-2xl font-bold text-[#00ace6] mb-1">
                    {selectedHotel.currency || "$"}
                    {selectedHotel.pricePerNight}
                    <span className="text-base text-gray-500">/night</span>
                  </div>
                  {selectedHotel.freeCancellation && (
                    <div className="text-green-600 font-medium text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Free cancellation
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHotel.amenities.slice(0, 6).map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-gray-700 text-xs bg-gray-50 p-1.5 rounded-lg"
                    >
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t space-y-3">
              <button
                onClick={() => handleBookHotel(selectedHotel)}
                className="w-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                disabled={!user}
              >
                <CreditCardIcon className="w-3.5 h-3.5" />
                {user ? 'Book Now' : 'Login to Book'}
              </button>
              <button
                onClick={() => setSelectedHotel(null)}
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFlightDetailsModal = (): React.ReactNode => {
    if (!selectedFlight) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedFlight.airline}</h3>
              <p className="text-gray-600 text-xs mt-0.5">
                {selectedFlight.from} → {selectedFlight.to}
              </p>
            </div>
            <button
              onClick={() => setSelectedFlight(null)}
              className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#00ace6] to-[#33bcff] flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-base">{selectedFlight.airline}</h4>
                <div className="text-gray-600 text-xs">
                  {selectedFlight.from} → {selectedFlight.to}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Flight Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="font-medium text-sm">{selectedFlight.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Stops</span>
                    <span className="font-medium text-sm">
                      {selectedFlight.stops || 0} ({selectedFlight.stops ? "With stops" : "Direct"})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Class</span>
                    <span className="font-medium text-sm capitalize">{selectedFlight.type || "economy"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Schedule & Price</h4>
                <div className="bg-gradient-to-r from-[#00ace6]/10 to-[#33bcff]/10 p-3 rounded-xl mb-3">
                  <div className="text-2xl font-bold text-[#00ace6] mb-1">
                    ${selectedFlight.price}
                  </div>
                  <div className="text-gray-500 text-xs">One way per person</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white border border-gray-200 p-2 rounded-lg">
                    <div className="text-xs text-gray-500 mb-0.5">Departure</div>
                    <div className="font-medium text-sm">
                      {selectedFlight.departureTime || "08:00 AM"}
                    </div>
                    <div className="text-xs text-gray-600">{selectedFlight.from}</div>
                  </div>
                  <div className="bg-white border border-gray-200 p-2 rounded-lg">
                    <div className="text-xs text-gray-500 mb-0.5">Arrival</div>
                    <div className="font-medium text-sm">
                      {selectedFlight.arrivalTime || "10:15 AM"}
                    </div>
                    <div className="text-xs text-gray-600">{selectedFlight.to}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t space-y-3">
              <button
                onClick={() => handleBookFlight(selectedFlight)}
                className="w-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                disabled={!user}
              >
                <CreditCardIcon className="w-3.5 h-3.5" />
                {user ? 'Book Now' : 'Login to Book'}
              </button>
              <button
                onClick={() => setSelectedFlight(null)}
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingForm = (): React.ReactNode => {
    if (!showBookingForm || !user) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {showBookingForm === 'hotel' ? 'Book Hotel' : 'Book Flight'}
              </h3>
              <p className="text-gray-600 text-xs mt-0.5">
                Complete your booking
              </p>
            </div>
            <button
              onClick={() => {
                setShowBookingForm(null);
                setBookingData({});
              }}
              className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#00ace6]/10 to-[#33bcff]/10 p-4 rounded-xl mb-4">
                <h4 className="font-bold text-base text-gray-800 mb-1">
                  {showBookingForm === 'hotel' ? selectedHotel?.name : selectedFlight?.airline}
                </h4>
                <p className="text-gray-600 text-sm">
                  {showBookingForm === 'hotel'
                    ? `${selectedHotel?.city}, ${selectedHotel?.country}`
                    : `${selectedFlight?.from} → ${selectedFlight?.to}`
                  }
                </p>
                {user && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                    <UserIcon className="w-3 h-3" />
                    <span>Booking for: <strong>{user.name}</strong></span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {showBookingForm === 'hotel' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={bookingData.checkIn || ''}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        min={bookingData.checkIn || today}
                        value={bookingData.checkOut || ''}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                      </label>
                      <select
                        value={bookingData.guest || 1}
                        onChange={(e) => setBookingData({...bookingData, guest: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                      </label>
                      <select
                        value={bookingData.hotelType || selectedHotel?.propertyType || 'Standard'}
                        onChange={(e) => setBookingData({...bookingData, hotelType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      >
                        <option value="Standard">Standard Room</option>
                        <option value="Deluxe">Deluxe Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Executive">Executive Suite</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={bookingData.date || ''}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Tickets
                      </label>
                      <select
                        value={bookingData.tickets || 1}
                        onChange={(e) => setBookingData({...bookingData, tickets: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'ticket' : 'tickets'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <select
                        value={bookingData.type || selectedFlight?.type || 'economy'}
                        onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ace6] focus:border-transparent"
                      >
                        <option value="economy">Economy</option>
                        <option value="premium">Premium Economy</option>
                        <option value="business">Business Class</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Total Price</span>
                    <span className="text-2xl font-bold text-[#00ace6]">
                      {showBookingForm === 'hotel' ?
                        `$${selectedHotel ? selectedHotel.pricePerNight * (bookingData.guest || 1) : '0'}` :
                        `$${selectedFlight ? selectedFlight.price * (bookingData.tickets || 1) : '0'}`
                      }
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={submitBooking}
                      disabled={bookingLoading || flightBookingLoading || hotelBookingLoading}
                      className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        bookingLoading || flightBookingLoading || hotelBookingLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white hover:shadow-lg'
                      }`}
                    >
                      {(bookingLoading || flightBookingLoading || hotelBookingLoading) ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCardIcon className="w-4 h-4" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowBookingForm(null);
                        setBookingData({});
                      }}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMarkdownText = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-base font-bold text-gray-800 mt-4 mb-2">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-sm font-semibold text-gray-800 mt-3 mb-1.5">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.includes('**') && line.includes('**')) {
        const parts = line.split('**');
        return (
          <span key={index}>
            {parts.map((part, i) =>
              i % 2 === 0 ? (
                part
              ) : (
                <strong key={i} className="font-semibold text-gray-800">
                  {part}
                </strong>
              )
            )}
          </span>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <span key={index}>{line}</span>;
    });
  };

  // زر الفتح العائم - أسفل اليمين
  if (!isOpen) {
    return (
      <button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-3xl z-50 ${isAnimating ? 'scale-0' : 'scale-100'}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff88] rounded-full animate-pulse"></div>
        </div>
      </button>
    );
  }

  // المودال المصغر - أسفل اليمين
  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 bg-gradient-to-r from-[#00ace6] to-[#33bcff] px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-50 transition-all duration-300 ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <button
          className="flex items-center gap-2 text-white hover:text-white/90 transition"
          onClick={toggleMinimize}
        >
          <MessageCircle size={18} />
          <span className="font-bold text-sm">🌍 Travel AI</span>
        </button>
        <div className="flex gap-1">
          <button
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            onClick={toggleMinimize}
          >
            <Maximize2 size={15} className="text-white" />
          </button>
          <button
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            onClick={closeChat}
          >
            <X size={15} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // المودال الرئيسي - أسفل اليمين
  return (
    <div className={`fixed inset-0 z-[60] flex items-end justify-end transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeChat}
      />
      <div className={`relative w-full max-w-lg h-[85vh] bg-white rounded-t-2xl overflow-hidden shadow-2xl transition-transform duration-300 ${isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        {/* الهيدر مع معلومات المستخدم */}
        <div className="bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white p-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  {user ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                  ) : (
                    <Compass className="w-6 h-6 text-white" />
                  )}
                </div>
                {user && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-xl">
                    {user ? `Hi, ${user.name}!` : '🌍 Travel AI'}
                  </h2>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse" />
                </div>
                <div className="text-sm text-white/90 mt-1 flex items-center gap-2">
                  <Smile className="w-3 h-3" />
                  <span>{user ? 'Personal Travel Assistant' : 'AI Travel Assistant'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                onClick={resetChat}
                title="Start Over"
              >
                <RefreshCw size={18} className="text-white" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                onClick={toggleMinimize}
              >
                <Minimize2 size={18} className="text-white" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                onClick={closeChat}
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

        
        </div>

        {/* المحتوى */}
        <div className="flex flex-col h-[calc(100%-88px)]">
          {viewMode === 'chat' ? (
            <>
              {/* منطقة الرسائل */}
              <div className="flex-1 overflow-y-auto p-5">
                {messages.map((message) => (
                  <div key={message.id} className="mb-4 animate-fadeIn">
                    <div className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender === 'bot' && (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="w-4.5 h-4.5 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-line text-sm">
                          {message.sender === 'bot'
                            ? renderMarkdownText(message.text)
                            : message.text}
                        </div>
                        <div
                          className={`text-xs mt-2 ${
                            message.sender === 'user'
                              ? 'text-white/80'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>

                      {message.sender === 'user' && (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00cc88] to-[#00ee99] flex items-center justify-center flex-shrink-0 shadow-md">
                          <Heart className="w-4.5 h-4.5 text-white" />
                        </div>
                      )}
                    </div>

                    {message.options && message.sender === 'bot' && (
                      <div className="flex flex-wrap gap-2 mb-4 ml-12">
                        {message.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-[#00ace6] hover:bg-[#00ace6]/5 text-gray-700 rounded-xl text-sm transition font-medium shadow-sm"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] flex items-center justify-center">
                      <Bot className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-[#00ace6] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#00ace6] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#00ace6] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* منطقة الإدخال */}
              <div className="border-t border-gray-200 p-5 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={user ? `Ask me anything, ${user.name.split(' ')[0]}...` : "Ask me anything about travel..."}
                      className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={loading || !inputText.trim()}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      loading || !inputText.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white hover:shadow-lg hover:scale-105 shadow-[#00ace6]/30'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 text-center mt-3">
                  {user ? `Travel smarter with Voya ! ✈️` : 'Powered by OpenAI GPT • Real-time APIs • 🌍 Travel smarter'}
                </div>
              </div>
            </>
          ) : viewMode === 'hotels' ? (
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-[#00ace6] to-[#33bcff] px-5 py-4 flex items-center justify-between">
                <button
                  className="flex items-center gap-2 text-white hover:text-white/90 transition"
                  onClick={() => setViewMode('chat')}
                >
                  <ChevronLeft size={24} />
                  <span className="font-medium">Back to Chat</span>
                </button>
                <div className="flex items-center gap-3">
                  <Hotel size={24} className="text-white" />
                  <span className="text-lg font-bold text-white">
                    Hotels {preferences.destination ? `in ${preferences.destination}` : ''}
                  </span>
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                  onClick={refreshData}
                >
                  <RefreshCw size={18} className="text-white" />
                </button>
              </div>

              {dataLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#00ace6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading hotel data...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-5">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 mb-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-base mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{hotel.city}, {hotel.country}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{hotel.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex">
                              {[...Array(Math.min(hotel.stars, 5))].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#00ace6]">
                            ${hotel.pricePerNight}
                            <span className="text-sm font-normal text-gray-500">/night</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedHotel(hotel)}
                          className="w-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white py-2.5 rounded-lg font-medium hover:shadow-md transition-all"
                        >
                          View Details & Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-[#00ace6] to-[#33bcff] px-5 py-4 flex items-center justify-between">
                <button
                  className="flex items-center gap-2 text-white hover:text-white/90 transition"
                  onClick={() => setViewMode('chat')}
                >
                  <ChevronLeft size={24} />
                  <span className="font-medium">Back to Chat</span>
                </button>
                <div className="flex items-center gap-3">
                  <Plane size={24} className="text-white" />
                  <span className="text-lg font-bold text-white">
                    Flights to {preferences.destination}
                  </span>
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                  onClick={refreshData}
                >
                  <RefreshCw size={18} className="text-white" />
                </button>
              </div>

              {dataLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#00ace6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading flight data...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-5">
                  {flights.map((flight) => (
                    <div
                      key={flight.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 mb-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-base mb-1">{flight.airline}</h3>
                          <div className="text-sm text-gray-600 mb-2">{flight.from} → {flight.to}</div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-500" />
                              {flight.duration}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs capitalize">
                              {flight.type || "economy"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#00ace6]">${flight.price}</div>
                          {flight.offer !== 'No offer' && (
                            <div className="text-xs text-green-600 font-medium mt-1">{flight.offer}</div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedFlight(flight)}
                          className="w-full bg-gradient-to-r from-[#00ace6] to-[#33bcff] text-white py-2.5 rounded-lg font-medium hover:shadow-md transition-all"
                        >
                          View Details & Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedHotel && renderHotelDetailsModal()}
      {selectedFlight && renderFlightDetailsModal()}
      {showBookingForm && renderBookingForm()}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default TravelAIChatbot;