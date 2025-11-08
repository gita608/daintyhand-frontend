import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { createOrder, getCart } from "@/services/api";
import { Loader2, MapPin, Phone, CreditCard } from "lucide-react";

const formSchema = z.object({
  shipping_name: z.string().min(2, "Name must be at least 2 characters"),
  shipping_address: z.string().min(10, "Address must be at least 10 characters"),
  shipping_city: z.string().min(2, "City is required"),
  shipping_state: z.string().min(2, "State is required"),
  shipping_pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  shipping_phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  payment_method: z.enum(["cod", "online", "card"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      });
      navigate('/login?redirect=/checkout');
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const response = await getCart();
      if (response.success) {
        setCartItems(response.data || []);
        if (response.data.length === 0) {
          toast({
            title: "Cart is empty",
            description: "Add items to your cart before checkout",
            variant: "destructive",
          });
          navigate('/cart');
        }
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch cart",
        variant: "destructive",
      });
    } finally {
      setCartLoading(false);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipping_name: "",
      shipping_address: "",
      shipping_city: "",
      shipping_state: "",
      shipping_pincode: "",
      shipping_phone: "",
      payment_method: "cod",
      notes: "",
    },
  });

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const priceNum = typeof price === 'string' ? parseFloat(price) : price;
      return total + (priceNum * item.quantity);
    }, 0).toFixed(2);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await createOrder(data);
      if (response.success) {
        toast({
          title: "Order Placed Successfully!",
          description: response.message || "Your order has been placed successfully",
        });
        navigate('/orders');
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-dainty-gray mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order details
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-6">
                Shipping Information
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="shipping_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your complete address" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shipping_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping_state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shipping_pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="6 digit pincode" {...field} className="h-12" maxLength={6} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="10 digit phone number" {...field} className="h-12" maxLength={10} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 mb-4">
                          <CreditCard className="w-4 h-4 text-primary" />
                          Payment Method
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="cursor-pointer">
                                Cash on Delivery (COD)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                              <RadioGroupItem value="online" id="online" disabled />
                              <Label htmlFor="online" className="cursor-not-allowed">
                                Online Payment <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                              <RadioGroupItem value="card" id="card" disabled />
                              <Label htmlFor="card" className="cursor-not-allowed">
                                Card Payment <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Any special instructions..." {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl"
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at delivery</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-dainty-gray">
                  <span>Total</span>
                  <span className="text-primary">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-dainty-gray mb-2">Items in Cart:</h3>
                {cartItems.map((item) => {
                  const title = item.product?.title || item.title || 'Product';
                  const price = item.product?.price || item.price || 0;
                  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
                  return (
                    <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                      <span>{title} x {item.quantity}</span>
                      <span>₹{(priceNum * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

