import { Link, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingBag, Package, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomepage = location.pathname === "/";

  // Don't show bottom nav on desktop or on homepage
  if (!isMobile || isHomepage) {
    return null;
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Sparkles, label: "Custom", path: "/custom-order" },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: ShoppingBag, label: "Cart", path: "/cart" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around px-1 py-2" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 touch-manipulation min-h-[60px] min-w-[60px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

