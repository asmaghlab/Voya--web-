import * as yup from "yup";


export const registerSchema = yup.object({
  name: yup
    .string()
    .min(3, "Please Enter your fullname")
    .max(15, "Max length is 15 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Please Enter a correct email")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Your password should be 8 characters")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain lower, upper characters and a symbol"
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),

  phone: yup.string().required("Phone number is required").matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),
  country: yup.string().required("Country is required"),
  role: yup.string().oneOf(["user"], "Invalid role").default("user"), // Default to 'user'
});


export type RegisterFormData = yup.InferType<typeof registerSchema>;


export const registerDefaultValues: Partial<RegisterFormData> = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  country: "",
  role: "user", // Default role for new users 
};