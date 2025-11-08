import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { getOrders } from "@/services/api";
import { Package, Calendar, IndianRupee, ArrowLeft, Loader2 } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    product_id: number;
    title: string;
    image: string;
    price: string;
    quantity: number;
  }>;
  created_at: string;
  shipping_address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

const OrderHistory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      if (response.success) {
        // Handle different response structures
        let ordersData = response.data;
        
        // If data is paginated, extract the array
        if (ordersData && typeof ordersData === 'object' && !Array.isArray(ordersData)) {
          // Check if it's a paginated response with a 'data' property
          if (Array.isArray(ordersData.data)) {
            ordersData = ordersData.data;
          } else if (Array.isArray(ordersData.orders)) {
            ordersData = ordersData.orders;
          } else {
            // If it's an object but not an array, default to empty array
            ordersData = [];
          }
        }
        
        // Ensure it's always an array
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch orders",
        variant: "destructive",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
        <Header />
        <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-dainty-gray mb-2">
              Order History
            </h1>
            <p className="text-muted-foreground">
              View all your past orders and track their status
            </p>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-playfair text-2xl font-semibold text-dainty-gray mb-2">
                  No Orders Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your order history here.
                </p>
                <Button onClick={() => navigate('/products')} className="bg-primary hover:bg-primary/90">
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white overflow-hidden">
                  <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="font-playfair text-xl mb-1">
                          Order #{order.order_number}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <div className="flex items-center gap-1 font-semibold text-lg">
                          <IndianRupee className="w-5 h-5" />
                          {parseFloat(order.total).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-dainty-gray mb-1">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Quantity: {item.quantity}</span>
                              <span className="flex items-center gap-1">
                                <IndianRupee className="w-3 h-3" />
                                {parseFloat(item.price).toLocaleString('en-IN')} each
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.shipping_address && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping_address.name}<br />
                          {order.shipping_address.address}<br />
                          {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                          Phone: {order.shipping_address.phone}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;

