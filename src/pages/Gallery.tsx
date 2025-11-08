import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Instagram, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts, getCategories } from "@/services/api";

interface Product {
  id: number;
  title: string;
  image: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        per_page: 50,
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
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-dainty-gray mb-6">
            Our Gallery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            Explore our collection of handcrafted creations. Each piece is lovingly made with attention to detail 
            and a passion for bringing beauty into your life.
          </p>
          
          {/* Instagram Link */}
          <div className="flex justify-center mb-8">
            <a 
              href="https://www.instagram.com/dainty.handd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow @dainty.handd</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 md:mb-12">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 md:gap-3 min-w-max px-4 md:justify-center">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                className="rounded-full px-4 md:px-6 py-2 text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedCategory("All")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.name === selectedCategory ? "default" : "outline"}
                  className="rounded-full px-4 md:px-6 py-2 text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-dainty-cream/30">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-playfair text-lg font-semibold mb-1">{product.title}</h3>
                    <p className="text-sm opacity-90">{product.category}</p>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-playfair text-base font-semibold text-dainty-gray mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Instagram CTA */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
          <Instagram className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-dainty-gray mb-4">
            See More on Instagram
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Follow us <a href="https://www.instagram.com/dainty.handd/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">@dainty.handd</a> for daily inspiration, 
            behind-the-scenes content, and the latest creations from our studio.
          </p>
          <a 
            href="https://www.instagram.com/dainty.handd/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-8 py-6 text-lg rounded-xl">
              <Instagram className="w-5 h-5 mr-2" />
              Visit Instagram
            </Button>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;

