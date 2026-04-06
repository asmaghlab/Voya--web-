// src/components/AdminSidebar.tsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  Hotel,
  Users,
  MessageSquare,
  FileBarChart,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch } from "@/routes/hooks";
import { logout } from "@/features/auth/authSlice";

export default function AdminSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Profile", path: "/AdminProfile", icon: <User size={20} /> },
    { name: "Dashboard", path: "/Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Flights", path: "/ManageFlights", icon: <Plane size={20} /> },
    { name: "Hotels", path: "/ManageHotels", icon: <Hotel size={20} /> },
    { name: "Users", path: "/ManageUsers", icon: <Users size={20} /> },
    { name: "Messages", path: "/AdminMessages", icon: <MessageSquare size={20} /> },
    { name: "Reports", path: "/Reports", icon: <FileBarChart size={20} /> },
  ];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = (
    <div
      className="h-full flex flex-col bg-[#0390b7] text-white shadow-xl transition-all duration-300 overflow-hidden"
      style={{ width: open ? 240 : 80 }}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
        {open && <h2 className="text-lg font-bold">Admin Panel</h2>}
        <button onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-white/30 transition">
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 text-sm
                ${active ? "bg-white text-[#00c0f5] font-semibold shadow" : "hover:bg-white/30"}`}
              style={{ justifyContent: open ? "flex-start" : "center" }}
            >
              <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
              {open && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/30 rounded-md flex items-center gap-2"
        >
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  const MobileNavbar = (
    <div className="fixed top-0 left-0 w-full h-20 bg-[#00c0f5] flex items-center justify-center px-2 z-50 text-white shadow">
      <div className="flex flex-row space-x-4 justify-center flex-nowrap overflow-x-auto w-full px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center text-xs font-semibold flex-shrink-0 text-white"
          >
            {item.icon}
            <span className="mt-1">{item.name}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-xs font-semibold flex-shrink-0 text-white"
        >
          <LogOut size={20} />
          <span className="mt-1">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex">
      {!isMobile && <aside className="fixed inset-y-0 left-0 z-50">{SidebarContent}</aside>}
      {isMobile && MobileNavbar}
      <div className={`flex-1 ${!isMobile ? (open ? "ml-60" : "ml-20") : "mt-20"} h-screen overflow-auto p-4`}>
        <Outlet />
      </div>
    </div>
  );
}