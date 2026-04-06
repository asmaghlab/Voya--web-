import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlaneTrail } from "@/components/decorations/PlaneTrail";
import { Landmarks } from "@/components/decorations/Landmarks";
import heroImage from "@/assets/travel.jpeg";
import TravelistaLogo from "@/assets/voya.png";
import ResetPasswordForm from "./ResetPasswordForm";
import { AppDispatch, RootState } from "@/routes/store";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const resetEmail = useSelector((state: RootState) => state.auth.resetEmail);
  const otpVerified = useSelector((state: RootState) => (state.auth as any).otpVerified);
  const isAuthorized = !!resetEmail && !!otpVerified;

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Traveler on mountain"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-start p-8 pt-20 text-center">
          <img
            src={TravelistaLogo}
            alt="Travelista Tours"
            className="w-64 md:w-80 mb-6 drop-shadow-2xl"
          />
          <p className="text-white max-w-md text-lg drop-shadow">
            Travel is the only purchase that enriches you in ways beyond
            material wealth
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative overflow-hidden">
        <div className="hidden lg:block">
          <PlaneTrail />
          <Landmarks />
        </div>

        <div className="w-full max-w-md px-8 py-12 relative z-10 space-y-6">
          {isAuthorized ? (
            <ResetPasswordForm />
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Access Denied
                </h2>
                <p className="text-red-600 text-base font-medium">
                  Invalid or expired reset request.
                </p>
                <p className="text-muted-foreground text-sm">
                  Please verify your email with the code we sent you.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  to="/forgot-password"
                  className="inline-block w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg transition-colors"
                >
                  Request New Code
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
