import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { getUser, updateProfile, changePassword, logout } from "@/services/api";
import { User, Mail, Phone, Lock, LogOut, Shield, Package } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await getUser();
        if (response.success) {
          setUser(response.data);
          profileForm.reset({
            name: response.data.name || "",
            phone: response.data.phone || "",
          });
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };
    
    fetchUser();
  }, [navigate, profileForm]);

  const onProfileSubmit = async (data: ProfileValues) => {
    setLoading(true);
    try {
      const response = await updateProfile({
        name: data.name,
        phone: data.phone || undefined,
      });
      if (response.success) {
        setUser(response.data);
        toast({
          title: "Profile Updated",
          description: response.message || "Your profile has been updated successfully.",
        });
      }
      setLoading(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.message || "Failed to update profile";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordValues) => {
    setLoading(true);
    try {
      const response = await changePassword({
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      if (response.success) {
        toast({
          title: "Password Changed",
          description: response.message || "Your password has been changed successfully.",
        });
        passwordForm.reset();
      }
      setLoading(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.message || "Failed to change password";
      toast({
        title: "Change Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate('/');
    } catch (error: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dainty-cream via-white to-dainty-pink/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-20 md:pt-24 pb-20 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-dainty-gray mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Personal Information
                </h2>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </FormLabel>
                      <Input 
                        value={user.email} 
                        disabled 
                        className="h-12 bg-muted"
                      />
                      <FormDescription>
                        Email cannot be changed
                      </FormDescription>
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+91 98765 43210" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="font-playfair text-2xl font-semibold text-dainty-gray mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Change Password
                </h2>

                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Current Password
                          </FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="At least 8 characters" {...field} className="h-12" />
                          </FormControl>
                          <FormDescription>
                            Must be at least 8 characters long
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="password_confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/orders')}
              className="w-full"
            >
              <Package className="w-5 h-5 mr-2" />
              View Order History
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleLogout}
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

