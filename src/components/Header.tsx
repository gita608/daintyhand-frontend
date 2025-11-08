import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  // Hide header on homepage for cleaner look
  const isHomepage = location.pathname === "/";
  
  // Show back button on all pages except home
  const showBackButton = location.pathname !== "/";
  
  // Scroll detection for auto-hide/show
  useEffect(() => {
    if (isHomepage || isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide header when scrolling down (only if scrolled past 100px)
      else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage, isMobile]);
  
  const handleBackClick = () => {
    // For product detail pages, navigate to products page
    if (location.pathname.startsWith('/product/')) {
      navigate('/products');
    } else {
      // For other pages, try to go back, fallback to home
      navigate(-1);
    }
  };
  
  // Don't render header on homepage or on mobile (bottom nav handles mobile)
  if (isHomepage || isMobile) {
    return null;
  }
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon"
              type="button"
              onClick={handleBackClick}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Link to="/" className="font-playfair text-2xl font-bold text-gradient">
            DaintyHand
          </Link>
        </div>
        
        <nav className="flex items-center gap-3">
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
