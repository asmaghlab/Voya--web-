import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { logout } from "@/features/auth/authSlice";
import { resetWishlist, fetchWishlist } from "@/pages/Wishlist/wishlistSlice";
import { WishlistButton } from "../UI/WishlistButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Countries", href: "/countries" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/aboutus" },
];

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.wishlist);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ---------------- FETCH WISHLIST ON LOAD ----------------
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetWishlist());
    navigate("/login");
  };

  const wishlistCount = items.length;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-foreground">Vo</span>
            <span className="text-primary">Ya</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Area */}
          <div className="flex items-center gap-4">

            {/* Wishlist Button */}
            <WishlistButton
              onToggle={() => navigate("/wishlist")}
              active={wishlistCount > 0}
              showBadge={true}
              badgeCount={wishlistCount}
            />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 bg-muted rounded-full hover:bg-muted/70 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm hidden md:inline">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg p-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {user.role === "user" && (
                      <Link
                        to="/MyBooking"
                        className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Bookings
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                  Login
                </button>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t">
          <nav className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block py-3 text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t my-3" />

            {user ? (
              <>
                <p className="text-sm text-muted-foreground mb-2">{user.name}</p>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {user.role === "user" && (
                  <Link
                    to="/MyBooking"
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-500 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};