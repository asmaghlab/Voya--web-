import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { Button } from "../../components/UI/button";
import { Input } from "@/components/UI/input";
import { PlaneTrail } from "@/components/decorations/PlaneTrail";
import { Landmarks } from "@/components/decorations/Landmarks";
import heroImage from "@/assets/travel.jpeg";
import TravelistaLogo from "@/assets/voya.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setResetEmail, setOtpVerified } from "@/features/auth/authSlice";
import { AppDispatch } from "@/routes/store";

export default function ForgotPassword() {
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [userEmail, setUserEmail] = useState<string>("");
  const [generatedOTP, setGeneratedOTP] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Generate 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");
      setIsSuccess(null);

      try {
        const { data: users } = await axios.get(
          "https://692b1d9e7615a15ff24ec4d9.mockapi.io/users"
        );

        const userExists = users.some((user) => user.email === values.email);

        if (!userExists) {
          setMessage("This email does not exist in our website.");
          setIsSuccess(false);
          setLoading(false);
          return;
        }

        // Generate OTP
        const otp = generateOTP();
        setGeneratedOTP(otp);
        setUserEmail(values.email);

        // Send OTP via email
        const templateParams = {
          to_email: values.email,
          email: values.email,
          otp_code: otp,
          user_email: values.email,
        };

        await emailjs.send(
          "Reset-Password",
          "template_0kycdlq",
          templateParams,
          "bgUuerEiCu9CnRx5X"
        );

        setMessage("Verification code has been sent to your email.");
        setIsSuccess(true);
        setStep("otp");
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong. Please try again.");
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "Code must be 6 digits")
        .matches(/^\d+$/, "Code must be numbers only")
        .required("Verification code is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");
      setIsSuccess(null);

      try {
        if (values.otp === generatedOTP) {
          setMessage("Verification successful! Redirecting...");
          setIsSuccess(true);

          // Save email and verification status in Redux
          dispatch(setResetEmail(userEmail));
          dispatch(setOtpVerified(true));

          // Redirect to reset password page without email in URL
          setTimeout(() => {
            navigate(`/reset-password`);
          }, 1500);
        } else {
          setMessage("Invalid verification code. Please try again.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong. Please try again.");
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      const otp = generateOTP();
      setGeneratedOTP(otp);

      const templateParams = {
        to_email: userEmail,
        email: userEmail,
        otp_code: otp,
        user_email: userEmail,
      };

      await emailjs.send(
        "Reset-Password",
        "template_0kycdlq",
        templateParams,
        "bgUuerEiCu9CnRx5X"
      );

      setMessage("New verification code has been sent!");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setMessage("Failed to resend code. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative">
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
            Travel is the only purchase that enriches you in ways beyond material wealth
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative overflow-hidden">
        <div className="hidden lg:block">
          <PlaneTrail />
          <Landmarks />
        </div>

        <div className="w-full max-w-md px-8 py-12 relative z-10 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">
              {step === "email" ? "Forgot Password" : "Verify Code"}
            </h2>
            <p className="text-muted-foreground text-sm drop-shadow">
              {step === "email"
                ? "Enter your email to receive verification code"
                : `Enter the 6-digit code sent to ${userEmail}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={emailFormik.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                  <legend className="ml-2 px-2 text-xs font-medium text-primary">Email</legend>
                  <div className="relative px-3 pb-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      className="pl-8 pr-3 h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                      {...emailFormik.getFieldProps("email")}
                    />
                  </div>
                </fieldset>
                {emailFormik.touched.email && emailFormik.errors.email && (
                  <p className="text-sm text-destructive">{emailFormik.errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl shadow-lg"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>

              {message && (
                <p
                  className={`text-center font-medium ${
                    isSuccess ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          ) : (
            <form onSubmit={otpFormik.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                  <legend className="ml-2 px-2 text-xs font-medium text-primary">
                    Verification Code
                  </legend>
                  <div className="relative px-3 pb-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="pl-8 pr-3 h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-center text-2xl tracking-widest font-semibold"
                      {...otpFormik.getFieldProps("otp")}
                    />
                  </div>
                </fieldset>
                {otpFormik.touched.otp && otpFormik.errors.otp && (
                  <p className="text-sm text-destructive">{otpFormik.errors.otp}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl shadow-lg"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              {message && (
                <p
                  className={`text-center font-medium ${
                    isSuccess ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setMessage("");
                    setIsSuccess(null);
                  }}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
