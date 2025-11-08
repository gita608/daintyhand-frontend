import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  product_id: number;
  title: string;
  price: string;
  image: string;
  description: string;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    try {
      const saved = localStorage.getItem('wishlist');
      const items = saved ? JSON.parse(saved) : [];
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (id: string) => {
    try {
      const updatedItems = wishlistItems.filter(item => item.id !== id);
      setWishlistItems(updatedItems);
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-dainty-gray mb-2">
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Start adding items you love to your wishlist
            </p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${item.product_id}`}>
                  <div className="relative aspect-square overflow-hidden bg-dainty-cream/30">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-playfair text-lg font-semibold text-dainty-gray mb-2 hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      {item.price}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1 bg-secondary hover:bg-dainty-blue-dark text-dainty-gray"
                      size="sm"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
