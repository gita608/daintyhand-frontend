import { Sparkles, Heart, Palette, Award, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-dainty-gray mb-6">
            About DaintyHand
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Creating beautiful, handcrafted treasures that celebrate life's most precious moments. 
            Every piece is made with love, attention to detail, and a passion for bringing your vision to life.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-dainty-gray mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-base md:text-lg">
                DaintyHand was born from a simple passion: creating beautiful, meaningful pieces that tell your story. 
                What started as a small hobby crafting invitations and decorative items has grown into a beloved brand 
                dedicated to making every celebration special.
              </p>
              <p className="text-base md:text-lg">
                We specialize in custom handmade crafts including wedding invitations, pressed flower art, 
                personalized cards, scrapbooks, and decorative pieces. Each creation is thoughtfully designed 
                and meticulously crafted using premium materials, ensuring that your special moments are captured 
                with elegance and charm.
              </p>
              <p className="text-base md:text-lg">
                Our work is inspired by nature, love, and the beauty found in everyday moments. We believe that 
                every piece should be as unique as the person it's created for, which is why we work closely with 
                our clients to bring their vision to life.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-playfair text-xl font-semibold text-dainty-gray mb-2">
              Made with Love
            </h3>
            <p className="text-sm text-muted-foreground">
              Every piece is crafted with genuine care and attention to detail
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Palette className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-playfair text-xl font-semibold text-dainty-gray mb-2">
              Custom Designs
            </h3>
            <p className="text-sm text-muted-foreground">
              Personalized creations tailored to your unique style and vision
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Award className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-playfair text-xl font-semibold text-dainty-gray mb-2">
              Premium Quality
            </h3>
            <p className="text-sm text-muted-foreground">
              Only the finest materials and techniques go into every creation
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-playfair text-xl font-semibold text-dainty-gray mb-2">
              Client Focused
            </h3>
            <p className="text-sm text-muted-foreground">
              Your satisfaction and happiness are our top priorities
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-dainty-gray mb-8 text-center">
              What We Create
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-dainty-gray">Wedding & Events</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Custom wedding invitations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Baby shower cards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Anniversary cards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Party invitations</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-dainty-gray">Art & Decor</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Pressed flower art</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Botanical wall hangings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Custom frames</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Decorative garlands</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-dainty-gray">Paper Crafts</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Handmade journals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Scrapbook albums</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Watercolor bookmarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Thank you cards</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-dainty-gray">Gift Items</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Handmade gift boxes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Custom name banners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Personalized gift wrap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Celebration garlands</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 via-dainty-pink/5 to-dainty-blue/5 rounded-2xl p-8 md:p-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-dainty-gray mb-4">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's bring your vision to life with a custom handmade piece
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/custom-order">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl">
                Start Custom Order
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-xl">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Social Section */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-muted-foreground mb-4">Follow our journey on Instagram</p>
          <a 
            href="https://www.instagram.com/dainty.handd/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            <span>@dainty.handd</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

