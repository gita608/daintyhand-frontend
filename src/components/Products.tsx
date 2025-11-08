import { useState, useEffect } from "react";
import { ShoppingBag, Heart, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getProducts, getCategories } from "@/services/api";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
                variant="default"
                className="rounded-full px-3 md:px-6 py-2 text-xs md:text-sm whitespace-nowrap flex-shrink-0"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="rounded-full px-3 md:px-6 py-2 text-xs md:text-sm whitespace-nowrap flex-shrink-0"
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
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-3 h-3 text-primary" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
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
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors">
                    <Heart className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
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
