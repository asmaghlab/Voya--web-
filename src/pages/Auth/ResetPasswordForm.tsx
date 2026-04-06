import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearResetData } from "@/features/auth/authSlice";
import { Input } from "../../components/UI/Input";
import { AppDispatch, RootState } from "@/routes/store";
import { toast } from "@/components/UI/sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<PasswordFormValues>({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .matches(
          /^[A-Z]\S{5,}$/,
          "Password must start with an uppercase letter and be at least 6 characters long."
        )
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(
        resetPassword({ newPassword: values.newPassword })
      );

      if (resetPassword.fulfilled.match(result)) {
        resetForm();
        dispatch(clearResetData());
        toast.success("Password has been successfully updated!");
        navigate("/login");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Reset Password</h2>
        <p className="text-muted-foreground text-sm drop-shadow">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="text-center text-red-600 font-medium mb-4">{error}</div>
      )}

      {/* New Password Field */}
      <div className="space-y-2">
        <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
          <legend className="ml-2 px-2 text-xs font-medium text-primary">
            New Password
          </legend>

          <div className="relative px-3 pb-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••••••••"
              className="pl-8 pr-10 h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              disabled={isLoading}
              {...formik.getFieldProps("newPassword")}
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
              disabled={isLoading}
            >
              {showNewPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </fieldset>
        {formik.touched.newPassword && formik.errors.newPassword && (
          <p className="text-sm text-destructive">
            {formik.errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <fieldset className="border-2 border-input rounded-xl focus-within:border-primary transition-colors">
          <legend className="ml-2 px-2 text-xs font-medium text-primary">
            Confirm Password
          </legend>

          <div className="relative px-3 pb-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="pl-8 pr-10 h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              disabled={isLoading}
              {...formik.getFieldProps("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </fieldset>

        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {formik.errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}