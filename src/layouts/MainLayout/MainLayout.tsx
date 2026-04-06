// TODO: implement
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Nav";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default MainLayout;
