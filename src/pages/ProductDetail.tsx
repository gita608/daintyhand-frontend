import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Star, ChevronLeft, Minus, Plus, Truck, Shield, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Product data - in a real app, this would come from an API
  const products = [
    {
      id: 1,
      title: "Floral Wedding Invitation Set",
      description: "Complete wedding suite with RSVP cards",
      fullDescription: "Elevate your wedding celebration with our exquisite handcrafted floral wedding invitation set. Each piece is meticulously crafted with premium cardstock and adorned with delicate watercolor florals. The set includes main invitation cards, RSVP cards, information cards, and elegant envelopes with custom wax seals.",
      price: "₹10,000",
      images: [
        "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
      ],
      category: "Invitations",
      rating: 5,
      reviews: 24,
      inStock: true,
      features: [
        "Premium 300gsm cardstock",
        "Hand-painted watercolor florals",
        "Custom wax seal included",
        "Personalization available",
        "Eco-friendly materials"
      ],
      specifications: {
        "Size": "5\" x 7\"",
        "Paper Weight": "300gsm",
        "Finish": "Matte",
        "Customization": "Available",
        "Production Time": "7-10 business days"
      }
    },
    // Add more products as needed
  ];

  const product = products.find(p => p.id === parseInt(id || "1")) || products[0];

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-dainty-pink/5 to-dainty-blue/5">
      <Header />
      
      {/* Product Details */}
      <section className="container px-4 md:px-6 py-8 md:py-12 pt-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="craft-card overflow-hidden rounded-2xl">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`craft-card overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </button>
              ))}
            </div>
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
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-primary mb-6">
                {product.price}
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {product.fullDescription}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-3 craft-card px-4 py-2 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    className="h-8 w-8"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-8 w-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-[0_10px_40px_-10px_hsl(340_70%_70%_/_0.25)] hover:shadow-[0_20px_60px_-15px_hsl(340_70%_70%_/_0.35)] transition-all duration-500 hover:-translate-y-1 shimmer"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-6 rounded-xl border-2 hover:bg-primary/10"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="craft-card p-6 rounded-xl space-y-3">
              <h3 className="font-semibold text-lg mb-4">Key Features</h3>
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
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
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-dainty-gray">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
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
