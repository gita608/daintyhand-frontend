import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Star, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { getProducts, addToCart, addToWishlist, removeFromWishlist, getWishlist } from "@/services/api";
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
}

const ProductCarousel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ per_page: 8 });
      if (response.success) {
        setProducts(response.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      if (response.success) {
        const wishlistProductIds = (response.data || []).map((item: any) => item.product_id);
        setWishlistItems(wishlistProductIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const response = await addToCart(product.id, 1);
      if (response.success) {
        toast({
          title: "Added to cart",
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

  const handleToggleWishlist = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (wishlistItems.includes(product.id)) {
        // Find wishlist item ID
        const wishlistResponse = await getWishlist();
        if (wishlistResponse.success) {
          const wishlistItem = (wishlistResponse.data || []).find((item: any) => item.product_id === product.id);
          if (wishlistItem) {
            await removeFromWishlist(wishlistItem.id);
            setWishlistItems(wishlistItems.filter(id => id !== product.id));
            toast({
              title: "Removed from wishlist",
              description: `${product.title} has been removed from your wishlist`,
            });
          }
        }
      } else {
        await addToWishlist(product.id);
        setWishlistItems([...wishlistItems, product.id]);
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

  const isInWishlist = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dainty-cream via-white to-dainty-lavender/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 animate-fade-up">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-3 md:mb-4">
            Featured <span className="text-gradient">Creations</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover our handpicked selection of the most beautiful arrangements
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading featured products...</p>
          </div>
        ) : products.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-1 md:-ml-2 lg:-ml-4">
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="pl-1 md:pl-2 lg:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                  <div 
                    className="group craft-card h-full shimmer cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                      <Link to={`/product/${product.id}`} aria-label={`${product.title} details`} className="block focus:outline-none w-full h-full">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button 
                          onClick={(e) => handleToggleWishlist(e, product)}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`p-1.5 md:p-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_-4px_hsl(220_10%_25%_/_0.15)] hover:bg-white transition-all hover:scale-110 ${
                            isInWishlist(product.id) ? 'bg-primary/20' : ''
                          }`}
                        >
                          <Heart className={`w-3 h-3 md:w-4 md:h-4 text-primary ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
                        <span className="bg-gradient-to-r from-primary/95 to-primary text-white text-xs px-2 md:px-3 py-1 rounded-full font-medium shadow-lg">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    
                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-2 md:mb-3">
                        <Link to={`/product/${product.id}`} aria-label={`${product.title} details`} className="flex-1">
                          <h3 className="font-playfair text-lg md:text-xl font-semibold text-dainty-gray line-clamp-2">
                            {product.title}
                          </h3>
                        </Link>
                        <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent ml-2 md:ml-3">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 md:w-4 md:h-4 transition-colors ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1 md:ml-2">
                            ({product.reviews_count})
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-2.5 md:py-3 rounded-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_hsl(340_70%_70%_/_0.3)] text-sm md:text-base shimmer"
                        size="sm"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-white hover:bg-white shadow-[0_10px_40px_-10px_hsl(220_10%_25%_/_0.15)] border-none hover:shadow-[0_20px_60px_-15px_hsl(340_70%_70%_/_0.25)] hover:scale-110 transition-all duration-300" />
            <CarouselNext className="hidden md:flex -right-12 bg-white hover:bg-white shadow-[0_10px_40px_-10px_hsl(220_10%_25%_/_0.15)] border-none hover:shadow-[0_20px_60px_-15px_hsl(340_70%_70%_/_0.25)] hover:scale-110 transition-all duration-300" />
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available</p>
          </div>
        )}

        <div className="text-center mt-8 md:mt-12">
          <Button 
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-dainty-gray font-semibold px-8 md:px-10 py-4 md:py-5 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(200_60%_75%_/_0.3)] text-sm md:text-base"
            onClick={() => navigate("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
