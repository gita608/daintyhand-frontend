import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show back button on all pages except home
  const showBackButton = location.pathname !== "/";
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
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
