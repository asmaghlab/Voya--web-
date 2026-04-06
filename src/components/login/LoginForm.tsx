import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/UI/button";
import { Input } from "../../components/UI/input";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";     
import { loginUser, clearError } from "@/features/auth/authSlice";        
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/useAuth"; 

// Yup Validation Schema
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

// TypeScript type for form data 
type LoginFormData = yup.InferType<typeof schema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);
  const { role, isLoggedIn } = useAuth(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isLoggedIn && user) {
      toast.success("Login successful!");

      if (role === "admin") {
        navigate("/Dashboard");
      } else {
        navigate("/"); 
      }
    }
  }, [isLoggedIn, user, role, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Email Input */}
      <div className="space-y-2">
        <div className="relative">
          <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
            <legend className="ml-2 px-2 text-xs font-medium text-primary">
              Email
            </legend>
            <div className="relative px-3 pb-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="thieuix@mail.com"
                className="pl-8 h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                disabled={isLoading}
                {...register("email")}
              />
            </div>
          </fieldset>
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="relative">
          <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
            <legend className="ml-2 px-2 text-xs font-medium text-primary">
              Password
            </legend>
            <div className="relative px-3 pb-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••"
                className="pl-8 pr-10 h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                disabled={isLoading}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                disabled={isLoading}
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </fieldset>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl shadow-lg disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "LOGIN"}
      </Button>
    </form>
  );
};
