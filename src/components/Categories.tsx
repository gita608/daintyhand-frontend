
import { Palette, Heart, Gift, Scissors } from "lucide-react";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  const categories = [
    {
      title: "Custom Invitations",
      description: "Elegant wedding invitations, party cards, and special occasion stationery designed to make your moments memorable.",
      icon: Heart,
      imageUrl: "https://images.unsplash.com/photo-1596796621994-453375a32338?auto=format&fit=crop&q=80&w=800",
      delay: 0
    },
    {
      title: "Decorative Art",
      description: "Hand-painted canvases, wall hangings, and artistic pieces that transform your space into a gallery of beauty.",
      icon: Palette,
      imageUrl: "https://images.unsplash.com/photo-1547990251-2bb4e10959b2?auto=format&fit=crop&q=80&w=800",
      delay: 200
    },
    {
      title: "Handmade Gifts",
      description: "Unique personalized gifts crafted with attention to detail, perfect for showing someone how much you care.",
      icon: Gift,
      imageUrl: "https://images.unsplash.com/photo-1555644026-d25ade221422?auto=format&fit=crop&q=80&w=800",
      delay: 400
    },
    {
      title: "Paper Crafts",
      description: "Intricate paper art, scrapbooking elements, and handcrafted paper goods that celebrate the beauty of traditional craftsmanship.",
      icon: Scissors,
      imageUrl: "https://images.unsplash.com/photo-1608231387042-89d0ac72c832?auto=format&fit=crop&q=80&w=800",
      delay: 600
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-4 md:mb-6">
            Our Craft Categories
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Each piece is thoughtfully created with premium materials and meticulous attention to detail
          </p>
        </div>
        
        {/* Mobile: Horizontal scroll */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar md:hidden">
          {categories.map((category) => (
            <div key={category.title} className="flex-shrink-0 w-[280px] snap-center animate-fade-up">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
        
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <div key={category.title} className="animate-fade-up">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
