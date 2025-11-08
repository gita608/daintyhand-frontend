import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { getCart, updateCartItem, removeFromCart as removeFromCartAPI } from "@/services/api";

interface CartItem {
  id: number | string;
  product_id: number;
  quantity: number;
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

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (response.success) {
        setCartItems(response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      const response = await removeFromCartAPI(id);
      if (response.success) {
        await fetchCart();
        toast({
          title: "Removed from cart",
          description: response.message || "Item has been removed from your cart",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await updateCartItem(id, newQuantity);
      if (response.success) {
        await fetchCart();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const priceNum = typeof price === 'string' ? parseFloat(price) : price;
      return total + (priceNum * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateSubtotal = (item: CartItem) => {
    const price = item.product?.price || item.price || 0;
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    return (priceNum * item.quantity).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-dainty-gray mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some beautiful handmade items to your cart
            </p>
            <Link to="/products">
              <Button className="bg-primary hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                // Handle both flat structure (from API) and nested structure
                const productId = item.product?.id || item.product_id;
                const title = item.product?.title || item.title || 'Product';
                const image = item.product?.image || item.image || '';
                const description = item.product?.description || item.description;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex gap-4 p-4">
                      <Link to={`/product/${productId}`} className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-dainty-cream/30">
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${productId}`}>
                          <h3 className="font-playfair text-lg font-semibold text-dainty-gray mb-1 hover:text-primary transition-colors line-clamp-2">
                            {title}
                          </h3>
                        </Link>
                        
                        {description && (
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {description}
                          </p>
                        )}

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 md:h-8 md:w-8 touch-manipulation"
                            onClick={() => updateQuantity(typeof item.id === 'string' ? parseInt(item.id) : item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4 md:w-3 md:h-3" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-base md:text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 md:h-8 md:w-8 touch-manipulation"
                            onClick={() => updateQuantity(typeof item.id === 'string' ? parseInt(item.id) : item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4 md:w-3 md:h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-primary">
                            ₹{calculateSubtotal(item)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(typeof item.id === 'string' ? parseInt(item.id) : item.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-semibold text-dainty-gray">
                    <span>Total</span>
                    <span className="text-primary">₹{calculateTotal()}</span>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                  Proceed to Checkout
                </Button>
                
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
