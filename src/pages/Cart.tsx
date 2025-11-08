import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: number;
  title: string;
  price: string;
  image: string;
  description: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    try {
      const saved = localStorage.getItem('cart');
      const items = saved ? JSON.parse(saved) : [];
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (id: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₹', '').replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateSubtotal = (item: CartItem) => {
    const price = parseFloat(item.price.replace('₹', '').replace('$', ''));
    return (price * item.quantity).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex gap-4 p-4">
                    <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-dainty-cream/30">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product_id}`}>
                        <h3 className="font-playfair text-lg font-semibold text-dainty-gray mb-1 hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-primary">
                            ₹{calculateSubtotal(item)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
