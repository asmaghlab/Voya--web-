import { useSelector } from "react-redux";
import { RootState } from "@/routes/store";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = user?.role || null;

  return { user, isLoggedIn, role };
};