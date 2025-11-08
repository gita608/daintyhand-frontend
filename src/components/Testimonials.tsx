
import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Bride",
      content: "The wedding invitations were absolutely stunning! Every detail was perfect, and our guests couldn't stop complimenting them. The quality and craftsmanship exceeded our expectations.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Art Collector",
      content: "I've purchased several decorative pieces, and each one is a masterpiece. The attention to detail and unique artistic vision makes these pieces truly special additions to our home.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Event Planner",
      content: "Working with this artisan has been a dream! Custom pieces for our events always receive amazing feedback from clients. Professional, creative, and reliable every time.",
      rating: 5
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dainty-gray mb-4 md:mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Real stories from people who have experienced the magic of handcrafted artistry
          </p>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar md:hidden">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name} 
              className="flex-shrink-0 w-[300px] snap-center craft-card p-6 relative animate-fade-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Quote className="w-6 h-6 text-primary mb-4" />
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-primary rounded-full mr-1"></div>
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                "{testimonial.content}"
              </p>

              <div className="border-t border-dainty-blue pt-3">
                <div className="font-semibold text-dainty-gray text-sm">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name} 
              className="craft-card p-6 md:p-8 relative animate-fade-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary mb-4 md:mb-6" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full mr-1"></div>
                ))}
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="border-t border-dainty-blue pt-4">
                <div className="font-semibold text-dainty-gray">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
