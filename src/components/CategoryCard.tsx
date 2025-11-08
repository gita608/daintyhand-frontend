
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageUrl: string;
  delay?: number;
}

const CategoryCard = ({ title, description, icon: Icon, imageUrl, delay = 0 }: CategoryCardProps) => {
  return (
    <div 
      className="group craft-card hover-lift relative h-80 shimmer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dainty-gray/90 via-dainty-gray/40 to-transparent" />
      </div>
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-[0_10px_40px_-10px_hsl(220_10%_25%_/_0.15)] group-hover:shadow-[0_20px_60px_-15px_hsl(340_70%_70%_/_0.25)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:from-primary/30 group-hover:to-accent/30 transition-colors duration-300">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-playfair text-xl font-semibold text-dainty-gray">{title}</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
