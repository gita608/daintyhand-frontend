import { useState, useEffect } from "react";
import { ShoppingBag, Heart, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getProducts, getCategories, addToCart, addToWishlist, removeFromWishlist, getWishlist } from "@/services/api";
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

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchProducts();
      await fetchWishlist();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 || selectedCategory === "All") {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, categories.length]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory === "All" ? undefined : selectedCategory;
      
      const response = await getProducts({ 
        per_page: 8,
        category: categoryParam
      });
      if (response.success) {
        setProducts(response.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    <section className="py-12 md:py-20 bg-gradient-to-br from-dainty-cream via-dainty-pink/5 to-dainty-blue/5">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-4 md:mb-6">
            Our Handmade Collection
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Each piece is lovingly crafted with attention to detail and made with premium materials
          </p>
          
          {/* Category Filter - Mobile Optimized */}
          <div className="overflow-x-auto pb-4 mb-8 md:mb-12">
            <div className="flex gap-2 md:gap-3 min-w-max px-4 md:justify-center">
              <Button
                key="all"
                variant={selectedCategory === "All" ? "default" : "outline"}
                className="rounded-full px-3 md:px-6 py-2 text-xs md:text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => handleCategoryChange("All")}
              >
                All
              </Button>
              {categories
                .filter((category) => category.name.toLowerCase() !== 'all')
                .map((category) => (
                <Button
                  key={category.id}
                  variant={category.name === selectedCategory ? "default" : "outline"}
                  className="rounded-full px-3 md:px-6 py-2 text-xs md:text-sm whitespace-nowrap flex-shrink-0"
                  onClick={() => handleCategoryChange(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal scroll */}
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar md:hidden">
              {products.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-[280px] snap-center"
            >
              <div 
                className="group craft-card animate-fade-up h-full cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button 
                      onClick={(e) => handleToggleWishlist(e, product)}
                      onMouseDown={(e) => e.preventDefault()}
                      className={`p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors ${
                        isInWishlist(product.id) ? 'bg-primary/20' : ''
                      }`}
                    >
                      <Heart className={`w-3 h-3 text-primary ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-playfair text-sm font-semibold text-dainty-gray line-clamp-2 flex-1">
                      {product.title}
                    </h3>
                    <span className="text-sm font-bold text-primary ml-1 flex-shrink-0">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviews_count})
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-secondary hover:bg-dainty-blue-dark text-dainty-gray font-semibold py-2 rounded-lg transition-colors duration-300 text-xs"
                    size="sm"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="group craft-card animate-fade-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button 
                    onClick={(e) => handleToggleWishlist(e, product)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors ${
                      isInWishlist(product.id) ? 'bg-primary/20' : ''
                    }`}
                  >
                    <Heart className={`w-3 h-3 md:w-4 md:h-4 text-primary ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-3 md:p-4">
                <div className="flex items-start justify-between mb-1 md:mb-2">
                  <h3 className="font-playfair text-sm md:text-lg font-semibold text-dainty-gray line-clamp-2 flex-1">
                    {product.title}
                  </h3>
                  <span className="text-sm md:text-lg font-bold text-primary ml-1 md:ml-2 flex-shrink-0">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 md:w-4 md:h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews_count})
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-secondary hover:bg-dainty-blue-dark text-dainty-gray font-semibold py-2 rounded-lg transition-colors duration-300 text-xs md:text-sm"
                  size="sm"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
          </>
        )}
        
        <div className="text-center mt-8 md:mt-12">
          <Button 
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 md:px-8 py-3 rounded-xl"
            onClick={() => navigate("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
