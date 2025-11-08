
import { Link } from "react-router-dom";
import { Heart, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dainty-cream text-dainty-gray py-12">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="font-playfair text-2xl font-bold mb-4">DaintyHand</h3>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-4">
              Creating unique, handmade treasures that celebrate life's special moments. 
              Every piece tells a story, crafted with passion and attention to detail.
            </p>
            <a 
              href="https://www.instagram.com/dainty.handd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              <Instagram className="w-5 h-5" />
              <span>@dainty.handd</span>
            </a>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/custom-order" className="hover:text-primary transition-colors">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Wedding Invitations
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Art Commissions
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Gift Wrapping
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 DaintyHand. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary fill-current" />
            <span>for creative souls</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
