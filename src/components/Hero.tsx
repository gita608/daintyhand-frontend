
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dainty-cream via-dainty-pink/10 to-dainty-blue/10"></div>
      <div className="absolute inset-0 decorative-dots opacity-30"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-4 md:top-20 md:left-10 animate-float">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl"></div>
      </div>
      <div className="absolute top-16 left-4 md:top-20 md:left-10 animate-pulse">
        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary opacity-60" />
      </div>
      
      <div className="absolute bottom-24 right-8 md:bottom-32 md:right-16 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 blur-2xl"></div>
      </div>
      <div className="absolute bottom-24 right-8 md:bottom-32 md:right-16 animate-pulse" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-secondary opacity-40" />
      </div>
      
      <div className="absolute top-1/3 right-8 md:right-20 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-lg"></div>
      </div>
      <div className="absolute top-1/3 right-8 md:right-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary opacity-80" />
      </div>

      <div className="container px-4 md:px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-up">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-dainty-gray mb-4 md:mb-6 leading-tight">
            Handcrafted
            <span className="text-gradient block mt-2">with Love & Care</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto font-light px-2 leading-relaxed">
            Discover unique handmade crafts, custom invitations, and beautiful decorative pieces 
            that tell your story with artisanal elegance.
          </p>
          
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-20 md:mb-24 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-2xl shadow-[0_10px_40px_-10px_hsl(340_70%_70%_/_0.25)] hover:shadow-[0_20px_60px_-15px_hsl(340_70%_70%_/_0.35)] transition-all duration-500 hover:-translate-y-1 shimmer"
            >
              Explore Collection
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-2 border-dainty-blue-dark/50 text-dainty-blue-dark hover:bg-dainty-blue-dark hover:text-white hover:border-dainty-blue-dark px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(200_60%_75%_/_0.3)]"
            >
              Custom Orders
            </Button>
          </div>
        </div>
      </div>
      
      {/* Arrow button - positioned relative to section */}
      <button 
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce-gentle hover:scale-110 transition-transform cursor-pointer p-2 md:p-3 rounded-full hover:bg-primary/10"
        aria-label="Scroll to content"
      >
        <ArrowDown className="w-5 h-5 md:w-7 md:h-7 text-primary opacity-80" />
      </button>
    </section>
  );
};

export default Hero;
