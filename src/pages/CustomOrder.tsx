import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { submitCustomOrder } from "@/services/api";
import { Sparkles, Mail, Phone, Calendar, Package, DollarSign, FileText } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  productType: z.string().min(1, "Please select a product type"),
  quantity: z.string().min(1, "Please enter quantity"),
  budget: z.string().min(1, "Please select a budget range"),
  eventDate: z.string().optional(),
  description: z.string().min(10, "Please provide at least 10 characters describing your custom order"),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CustomOrder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      productType: "",
      quantity: "",
      budget: "",
      eventDate: "",
      description: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await submitCustomOrder({
        name: data.name,
        email: data.email,
        phone: data.phone,
        product_type: data.productType,
        quantity: data.quantity,
        budget: data.budget,
        event_date: data.eventDate || undefined,
        description: data.description,
        additional_notes: data.additionalNotes || undefined,
      });
      if (response.success) {
        toast({
          title: "Order Submitted Successfully!",
          description: response.message || "We've received your custom order request. Our team will contact you within 24-48 hours.",
        });
        form.reset();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.message || "Failed to submit order. Please try again.";
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-dainty-gray mb-4">
            Custom Order Request
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Have something special in mind? Let's create it together! Fill out the form below and we'll get back to you with a personalized quote.
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 98765 43210" {...field} className="h-12" />
                        </FormControl>
                        <FormDescription>
                          We'll use this to contact you about your order
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-6"></div>

                {/* Order Details Section */}
                <div className="space-y-4">
                  <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Order Details
                  </h2>

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select a product type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="invitations">Invitations</SelectItem>
                            <SelectItem value="wall-art">Wall Art</SelectItem>
                            <SelectItem value="paper-crafts">Paper Crafts</SelectItem>
                            <SelectItem value="albums">Albums</SelectItem>
                            <SelectItem value="cards">Cards</SelectItem>
                            <SelectItem value="decorations">Decorations</SelectItem>
                            <SelectItem value="journals">Journals</SelectItem>
                            <SelectItem value="gift-wrap">Gift Wrap</SelectItem>
                            <SelectItem value="frames">Frames</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 50" min="1" {...field} className="h-12" />
                          </FormControl>
                          <FormDescription>
                            How many items do you need?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Budget Range *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-5k">Under ₹5,000</SelectItem>
                              <SelectItem value="5k-10k">₹5,000 - ₹10,000</SelectItem>
                              <SelectItem value="10k-25k">₹10,000 - ₹25,000</SelectItem>
                              <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                              <SelectItem value="50k-plus">₹50,000+</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Event/Deadline Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-12" />
                        </FormControl>
                        <FormDescription>
                          When do you need this by? (Optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-6"></div>

                {/* Description Section */}
                <div className="space-y-4">
                  <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Tell Us About Your Vision
                  </h2>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your custom order in detail. Include colors, themes, style preferences, size requirements, and any specific details you have in mind..."
                            rows={6}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more details you provide, the better we can understand your vision
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any other information, special requests, or questions you'd like to share..."
                            rows={4}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {loading ? "Submitting..." : "Submit Custom Order Request"}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    * Required fields. We'll respond within 24-48 hours.
                  </p>
                </div>
              </form>
            </Form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/20">
            <h3 className="font-semibold text-dainty-gray mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>We'll review your request and get back to you within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>We'll discuss your vision and provide a detailed quote</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Once approved, we'll begin crafting your custom piece</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>We'll keep you updated throughout the creation process</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomOrder;

