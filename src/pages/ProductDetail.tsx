import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Star, ChevronLeft, Minus, Plus, Truck, Shield, RefreshCw, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, addToCart, addToWishlist, removeFromWishlist, getWishlist } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  images?: Array<{ id: number; image_url: string }>;
  features?: Array<{ id: number; feature: string }>;
  specifications?: Array<{ id: number; key: string; value: string }>;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkWishlist();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(parseInt(id || "1"));
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await getWishlist();
      if (response.success) {
        const productId = parseInt(id || "1");
        const inWishlist = (response.data || []).some((item: any) => item.product_id === productId);
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-dainty-pink/5 to-dainty-blue/5">
        <Header />
        <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-dainty-pink/5 to-dainty-blue/5">
        <Header />
        <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 text-center">
          <h1 className="font-playfair text-3xl font-bold text-dainty-gray mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = async () => {
    try {
      const response = await addToCart(product.id, quantity);
      if (response.success) {
        toast({
          title: "Added to Cart",
          description: response.message || `${product.title} has been added to your cart`,
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

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        const wishlistResponse = await getWishlist();
        if (wishlistResponse.success) {
          const wishlistItem = (wishlistResponse.data || []).find((item: any) => item.product_id === product.id);
          if (wishlistItem) {
            await removeFromWishlist(wishlistItem.id);
            setIsInWishlist(false);
            toast({
              title: "Removed from wishlist",
              description: `${product.title} has been removed from your wishlist`,
            });
          }
        }
      } else {
        await addToWishlist(product.id);
        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: `${product.title} has been added to your wishlist`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-dainty-pink/5 to-dainty-blue/5">
      <Header />
      
      {/* Product Details */}
      <section className="container px-4 md:px-6 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="craft-card overflow-hidden rounded-2xl">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images && product.images.length > 0 
                    ? product.images[selectedImage]?.image_url || product.image
                    : product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`craft-card overflow-hidden rounded-lg transition-all duration-300 ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                {product.category}
              </span>
              <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-4">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-primary mb-6">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm md:text-base font-medium">Quantity:</span>
                <div className="flex items-center gap-3 craft-card px-4 py-2 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    className="h-10 w-10 md:h-8 md:w-8 touch-manipulation"
                  >
                    <Minus className="w-5 h-5 md:w-4 md:h-4" />
                  </Button>
                  <span className="font-semibold w-12 md:w-8 text-center text-base md:text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10 md:h-8 md:w-8 touch-manipulation"
                  >
                    <Plus className="w-5 h-5 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-4 md:py-6 text-base md:text-lg rounded-xl shadow-[0_10px_40px_-10px_hsl(340_70%_70%_/_0.25)] hover:shadow-[0_20px_60px_-15px_hsl(340_70%_70%_/_0.35)] transition-all duration-500 hover:-translate-y-1 shimmer touch-manipulation min-h-[48px]"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={`px-6 py-4 md:py-6 rounded-xl border-2 touch-manipulation min-h-[48px] min-w-[48px] ${
                    isInWishlist 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="craft-card p-6 rounded-xl space-y-3">
              <h3 className="font-semibold text-lg mb-4">Key Features</h3>
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <div key={feature.id || index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm text-muted-foreground">{feature.feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No features listed</p>
              )}
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="craft-card p-4 rounded-lg text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="craft-card p-4 rounded-lg text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="craft-card p-4 rounded-lg text-center">
                <RefreshCw className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12 md:mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-transparent border-b rounded-none">
              <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="craft-card p-6 md:p-8 rounded-2xl">
              <h3 className="font-playfair text-2xl font-bold mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.fullDescription}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each piece is handcrafted with love and attention to detail. We use only the finest materials to ensure your special moments are captured beautifully. Perfect for weddings, celebrations, and special occasions.
              </p>
            </TabsContent>

            <TabsContent value="specifications" className="craft-card p-6 md:p-8 rounded-2xl">
              <h3 className="font-playfair text-2xl font-bold mb-6">Specifications</h3>
              <div className="space-y-4">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec) => (
                    <div key={spec.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-dainty-gray">{spec.key}</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-3">No specifications available</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="craft-card p-6 md:p-8 rounded-2xl">
              <h3 className="font-playfair text-2xl font-bold mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <h4 className="font-semibold mb-2">Beautiful craftsmanship!</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Absolutely love this product! The attention to detail is incredible and it exceeded my expectations.
                    </p>
                    <span className="text-xs text-muted-foreground">- Sarah M., 2 weeks ago</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
