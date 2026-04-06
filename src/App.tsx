import { Provider } from "react-redux";
import { store } from "@/routes/store";
import { Toaster } from "@/components/UI/toaster";
import { Toaster as Sonner } from "@/components/UI/sonner";
import { TooltipProvider } from "@/components/UI/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoute from "@/routes/AdminRoute";

import NotFound from "@/pages/Auth/NotFound";
import Login from "@/pages/Auth/LoginPage";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPasswordPage from "@/pages/Auth/ResetPassword";
import Register from "@/pages/Auth/SignUp";
import Home from "@/pages/Home/Home";

import MainLayout from "@/layouts/MainLayout/MainLayout";
import CountriesPage from "@/pages/Countries/CountriesPage";
import CountryDetailsPage from "@/pages/Countries/CountryDetailsPage";
import Flights from "./pages/Flights/Flights";
import FlightDetails from "./pages/Flights/FlightDetails";
import {FlightBookingForm}  from "./pages/booking/FlightBookingForm"; 
import { HotelBookingForm } from "./pages/booking/HotelBookingForm";
import Profile from "./pages/Profile/Profile";
import HotelWrapper from "./pages/Hotels/HotelWrapper";
import HotelDetails from "./pages/Hotels/HotelDetails";
import WishlistPage from "./pages/Wishlist/WishlistPage";

import Dashboard from "./layouts/DashboardLayout/DashboardLayout";
import ManageFlights from "./pages/Admin/ManageFlights";
import ManageHotels from "./pages/Admin/ManageHotels";
import ManageUsers from "./pages/Admin/ManageUsers";
import Reports from "./pages/Admin/Reports";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminSidebar from "./layouts/DashboardLayout/DashboardLayout";
import AdminProfile from "./pages/Admin/AdminProfile";

import AboutUsPage from './pages/AboutUs/AboutUsPage';
import ContactPage from './pages/Contact/ContactPage';
import AdminMessages from './pages/Admin/AdminMessages';
import MyBooking from "./pages/MyBooking/MyBooking";



const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* ---------- Public Routes ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* ---------- Admin Protected Routes ---------- */}
          <Route element={<AdminRoute><AdminSidebar /></AdminRoute>}>
          <Route path="/Dashboard" element={<AdminDashboard />} />
          <Route path="/ManageFlights" element={<ManageFlights />} />
          
          <Route path="/ManageHotels" element={<ManageHotels />} />
          <Route path="/ManageUsers" element={<ManageUsers />} />
          <Route path="/AdminMessages" element={<AdminMessages/>} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/AdminProfile" element={<AdminProfile/>} />  
        </Route> 
            {/* ---------- Main Layout Routes (Protected User) ---------- */}
            <Route element={<MainLayout />}>
              {/* Profile */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              {/* MyBooking*/}
               <Route path="MyBooking" element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />
              {/* Wishlist */}
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              {/* Hotel Booking */}
              <Route path="/hotelform" element={<ProtectedRoute><HotelBookingForm hotelId={""} hotelName={""} /></ProtectedRoute>} />
              <Route path="/hotelform/:hotelId/:hotelName" element={<ProtectedRoute><HotelBookingForm hotelId={""} hotelName={""}/></ProtectedRoute>} />
              {/* Flights */}
              <Route path="/flights" element={<ProtectedRoute><Flights /></ProtectedRoute>} />
              <Route path="/flight/:flightId" element={<ProtectedRoute><FlightDetails /></ProtectedRoute>} />
              {/* Hotels */}
              <Route path="/hotels" element={<ProtectedRoute><HotelWrapper /></ProtectedRoute>} />
              <Route path="/hotels/:id" element={<ProtectedRoute><HotelDetails /></ProtectedRoute>} />
              {/* Countries */}
              <Route path="/countries" element={<ProtectedRoute><CountriesPage /></ProtectedRoute>} />
              <Route path="/country/:id" element={<ProtectedRoute><CountryDetailsPage /></ProtectedRoute>} />
              {/* AboutUs */}
              <Route path="/aboutus" element={<ProtectedRoute><AboutUsPage/></ProtectedRoute>} />
              {/* ContactUs */}
              <Route path="/contact" element={<ProtectedRoute><ContactPage/></ProtectedRoute>} />
            </Route>
            {/* ---------- 404 ---------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;