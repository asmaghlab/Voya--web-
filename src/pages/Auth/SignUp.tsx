import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//import bcrypt from "bcryptjs";


import { useNavigate, Link } from "react-router-dom";



import { User, Mail, Phone, Globe, Lock } from "lucide-react";

import heroImage from "@/assets/travel.jpeg";
import TravelistaLogo from "@/assets/voya.png";
import { PlaneTrail } from "@/components/decorations/PlaneTrail";
import { Landmarks } from "@/components/decorations/Landmarks";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";

import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { registerUser } from "../../features/auth/authSlice";
import { registerSchema, RegisterFormData } from "../../utils/schema/signupSchema";
import { RootState } from "../../routes/store";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state:RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "user", // Default role for new users
      country: "",
    },
    
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        country: data.country,
        role: data.role, 
      })).unwrap();

      // بعد ما التسجيل ينجح، نروح للـ login page
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroImage} alt="Traveler" className="w-full h-full object-cover" />
       
       
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-start p-8 pt-20 text-center">
          <img src={TravelistaLogo} className="w-64 md:w-80 mb-6 drop-shadow-2xl" alt="Travel" />
          
          
          <p className="text-white max-w-md text-lg drop-shadow">
            Travel is the only purchase that enriches you in ways beyond material wealth
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative">
        <div className="hidden lg:block"><PlaneTrail /></div>
        <div className="hidden lg:block"><Landmarks /></div>

        <div className="w-full max-w-md px-8 py-12 relative z-10 space-y-6">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
            <p className="text-muted-foreground text-sm drop-shadow">
              Sign up to start your journey with us
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

           
            <div className="space-y-2">
              <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-primary">Full Name</legend>
              
              
                <div className="relative px-3 pb-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="pl-8 h-10 border-0 focus-visible:ring-0 bg-transparent"
                        placeholder="Enter your name"
                      />
                    )}
                  />
                </div>
              </fieldset>
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

         
            <div className="space-y-2">
              <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-primary">Email</legend>
              
              
                <div className="relative px-3 pb-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        className="pl-8 h-10 border-0 focus-visible:ring-0 bg-transparent"
                        placeholder="example@mail.com"
                      />
                    )}
                  />
                </div>
              </fieldset>
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

           
            <div className="space-y-2">
              <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-primary">Phone</legend>
               
               
                <div className="relative px-3 pb-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className="pl-8 h-10 border-0 focus-visible:ring-0 bg-transparent"
                        placeholder="01xxxxxxxxx"
                      />
                    )}
                  />
                </div>
              </fieldset>
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>

           
            <div className="space-y-2">
              <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-primary">Country</legend>
              
              
                <div className="relative px-3 pb-2">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="pl-10 h-10 w-full bg-transparent border-0 focus:ring-0">
                        <option value="">Select Country</option>
                        <option value="Egypt">Egypt</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="UAE">UAE</option>
                        <option value="Qatar">Qatar</option>
                      </select>
                    )}
                  />
                </div>
              </fieldset>
              {errors.country && <p className="text-destructive text-sm">{errors.country.message}</p>}
            </div>

           
            <div className="space-y-2">
              <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-primary">Password</legend>
                <div className="relative px-3 pb-2 flex items-center">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pl-8 h-10 border-0 focus-visible:ring-0 bg-transparent"
                        placeholder="Enter password"
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </fieldset>
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

           
            <div className="space-y-2">
              <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
                <legend className="ml-2 px-2 text-xs font-medium text-primary">Confirm Password</legend>
                <div className="relative px-3 pb-2 flex items-center">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-8 h-10 border-0 focus-visible:ring-0 bg-transparent"
                        placeholder="Confirm password"
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </fieldset>
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base rounded-xl shadow-lg"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login Now
              </Link>
            </p>
          </div>

        </div>
      </div>
  
  
    </div>
  );
}


