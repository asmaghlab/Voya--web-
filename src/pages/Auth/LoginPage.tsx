import { LoginForm } from "@/components/login/LoginForm";
import { SocialLoginButtons } from "@/components/login/SocialLoginButtons";
import { PlaneTrail } from "@/components/decorations/PlaneTrail";
import { Landmarks } from "@/components/decorations/Landmarks";
import heroImage from "@/assets/travel.jpeg";
import TravelistaLogo from "@/assets/voya.png";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* LEFT SIDE - only for desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={heroImage}
          alt="Traveler on mountain"
          className="w-full h-full object-cover max-h-screen"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-start  pt-6 text-center">
          <img 
            src={TravelistaLogo} 
            alt="Travelista Tours" 
            className="w-64 md:w-80 mb-6 drop-shadow-2xl"
          />
          <p className="text-white max-w-md text-lg drop-shadow">
            Travel is the only purchase that enriches you in ways beyond material wealth
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative overflow-hidden">
        {/* Decorative components - desktop only */}
        <div className="hidden lg:block absolute inset-0">
          <PlaneTrail />
          <Landmarks />
        </div>

        <div className="w-full max-w-md px-6 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-2">Welcome</h2>
            <p className="text-muted-foreground text-sm drop-shadow">Login with Email</p>
          </div>

          <LoginForm />

          <div className="mt-8">
            <SocialLoginButtons />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}