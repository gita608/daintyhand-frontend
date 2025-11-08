import { useState, useEffect } from "react";
import { Palette, Heart, Gift, Scissors, Loader2 } from "lucide-react";
import CategoryCard from "./CategoryCard";
import { getCategories } from "@/services/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('invitation') || name.includes('card')) return Heart;
  if (name.includes('art') || name.includes('decorative')) return Palette;
  if (name.includes('gift')) return Gift;
  return Scissors;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        // Filter out "All" category
        const filteredCategories = (response.data || []).filter(
          (cat: Category) => cat.name.toLowerCase() !== 'all'
        );
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform API categories to CategoryCard format
  const transformedCategories = categories.map((category, index) => ({
    title: category.name,
    description: category.description || `Explore our beautiful collection of ${category.name.toLowerCase()}`,
    icon: getCategoryIcon(category.name),
    imageUrl: category.image || "https://images.unsplash.com/photo-1596796621994-453375a32338?auto=format&fit=crop&q=80&w=800",
    delay: index * 200
  }));

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          {/* Title and Description Section */}
          <div className="text-center mb-8 md:mb-12 animate-fade-up">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-3 md:mb-4">
              Our Craft <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Explore our handpicked selection of beautifully crafted categories
            </p>
          </div>
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (transformedCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        {/* Title and Description Section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-up">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-3 md:mb-4">
            Our Craft <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Explore our handpicked selection of beautifully crafted categories
          </p>
        </div>

        {/* Horizontal scroll for all screen sizes */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
          {transformedCategories.map((category) => (
            <div key={category.title} className="flex-shrink-0 w-[280px] md:w-[320px] snap-center animate-fade-up">
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
