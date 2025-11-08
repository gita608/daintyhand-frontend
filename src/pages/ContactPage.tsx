import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Phone, MapPin, Instagram, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would send data to a backend API
    console.log("Contact Form Submission:", data);
    
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out! We'll get back to you within 24-48 hours.",
    });

    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <MessageSquare className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-dainty-gray mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Have a question, want to discuss a custom order, or just want to say hello? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-dainty-gray mb-6">
                Let's Create Something Beautiful Together
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Ready to bring your vision to life? Get in touch for custom orders, 
                collaborations, or just to say hello! We're here to help make your special moments unforgettable.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-dainty-gray text-lg mb-1">Email</div>
                  <a href="mailto:hello@daintyhand.com" className="text-muted-foreground hover:text-primary transition-colors">
                    hello@daintyhand.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-dainty-gray text-lg mb-1">Phone</div>
                  <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-dainty-gray text-lg mb-1">Studio</div>
                  <p className="text-muted-foreground">
                    We work from our cozy studio, creating beautiful pieces for clients worldwide.
                    <br />
                    <span className="text-sm">Available for local consultations by appointment.</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Instagram className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-dainty-gray text-lg mb-1">Follow Us</div>
                  <a 
                    href="https://www.instagram.com/dainty.handd/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    @dainty.handd
                    <span className="text-xs">(opens in new tab)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">Connect with us on social media</p>
              <div className="flex gap-3">
                <a 
                  href="https://www.instagram.com/dainty.handd/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Instagram className="w-6 h-6 text-dainty-gray" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-dainty-gray mb-6">
              Send us a message
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project, questions, or just say hello..."
                          rows={6}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The more details you provide, the better we can assist you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;

