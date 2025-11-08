import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductCarousel from "@/components/ProductCarousel";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header is hidden on homepage for cleaner look */}
      <Header />
      
      {/* Floating menu button for homepage - appears when header is hidden */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link to="/wishlist">
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-background/80 backdrop-blur-md border border-border shadow-lg hover:bg-background/90 h-12 w-12"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/cart">
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-background/80 backdrop-blur-md border border-border shadow-lg hover:bg-background/90 h-12 w-12"
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      
      <Hero />
      <Categories />
      <ProductCarousel />
      <Products />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
