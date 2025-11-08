import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { getWishlist, removeFromWishlist as removeFromWishlistAPI, addToCart } from "@/services/api";

interface WishlistItem {
  id: number | string;
  product_id: number;
  // Backend returns flat structure (not nested product object)
  title?: string;
  price?: string | number;
  image?: string;
  description?: string;
  // Also support nested structure if backend changes
  product?: {
    id: number;
    title: string;
    price: number;
    image: string;
    description?: string;
  };
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlist();
      if (response.success) {
        const items = response.data || [];
        // Backend returns flat structure, so we use it directly
        setWishlistItems(items);
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: number) => {
    try {
      const response = await removeFromWishlistAPI(id);
      if (response.success) {
        await fetchWishlist();
        toast({
          title: "Removed from wishlist",
          description: response.message || "Item has been removed from your wishlist",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await addToCart(productId, 1);
      if (response.success) {
        toast({
          title: "Added to Cart",
          description: response.message || "Item has been added to your cart",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
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
            {wishlistItems.map((item) => {
              // Handle both flat structure (from API) and nested structure
              const productId = item.product?.id || item.product_id;
              const title = item.product?.title || item.title || 'Product';
              const image = item.product?.image || item.image || '';
              const description = item.product?.description || item.description;
              const price = item.product?.price || item.price || 0;
              const priceNum = typeof price === 'string' ? parseFloat(price) : price;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/product/${productId}`}>
                    <div className="relative aspect-square overflow-hidden bg-dainty-cream/30">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${productId}`}>
                      <h3 className="font-playfair text-lg font-semibold text-dainty-gray mb-2 hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                    </Link>
                    
                    {description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        ₹{priceNum.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-secondary hover:bg-dainty-blue-dark text-dainty-gray"
                        size="sm"
                        onClick={() => handleAddToCart(productId)}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist(typeof item.id === 'string' ? parseInt(item.id) : item.id)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
