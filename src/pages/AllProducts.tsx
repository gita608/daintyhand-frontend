import { useState } from "react";
import { ShoppingBag, Heart, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { products as allProducts, categories } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AllProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products based on search and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleWishlist = (e: React.MouseEvent, product: typeof allProducts[0]) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('wishlist');
      const wishlist = saved ? JSON.parse(saved) : [];
      
      const exists = wishlist.find((item: any) => item.product_id === product.id);
      
      if (exists) {
        const updated = wishlist.filter((item: any) => item.product_id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        toast({
          title: "Removed from wishlist",
          description: `${product.title} has been removed from your wishlist`,
        });
      } else {
        const newItem = {
          id: crypto.randomUUID(),
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
        };
        wishlist.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        toast({
          title: "Added to wishlist",
          description: `${product.title} has been added to your wishlist`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: number) => {
    try {
      const saved = localStorage.getItem('wishlist');
      const wishlist = saved ? JSON.parse(saved) : [];
      return wishlist.some((item: any) => item.product_id === productId);
    } catch {
      return false;
    }
  };

  const addToCart = (e: React.MouseEvent, product: typeof allProducts[0]) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('cart');
      const cart = saved ? JSON.parse(saved) : [];
      
      const existingItem = cart.find((item: any) => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        toast({
          title: "Updated cart",
          description: `${product.title} quantity updated`,
        });
      } else {
        const newItem = {
          id: crypto.randomUUID(),
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1,
        };
        cart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        toast({
          title: "Added to cart",
          description: `${product.title} has been added to your cart`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-dainty-pink/5 to-dainty-blue/5">
      <Header />
      <div className="container px-4 md:px-6 py-8 md:py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-dainty-gray mb-4">
            All Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of handmade crafts
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 py-6 text-base"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="overflow-x-auto pb-4 mb-8">
          <div className="flex gap-2 md:gap-3 min-w-max px-4 md:justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className="rounded-full px-4 md:px-6 py-2 text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {currentProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
            {currentProducts.map((product, index) => (
              <div
                key={product.id}
                className="group craft-card animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => toggleWishlist(e, product)}
                      className="p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-primary fill-current' : 'text-primary'}`}
                      />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <h3 className="font-playfair text-sm md:text-lg font-semibold text-dainty-gray line-clamp-2 flex-1">
                      {product.title}
                    </h3>
                    <span className="text-sm md:text-lg font-bold text-primary flex-shrink-0">
                      {product.price}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 hidden md:block">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-0.5 md:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 md:w-4 md:h-4 ${
                            i < product.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-secondary hover:bg-dainty-blue-dark text-dainty-gray font-semibold py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors duration-300"
                    size="sm"
                    onClick={(e) => addToCart(e, product)}
                  >
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">Add to Cart</span>
                    <span className="md:hidden">Add</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <PaginationItem key={pageNumber}>...</PaginationItem>;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
