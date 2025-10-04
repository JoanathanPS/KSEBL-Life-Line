import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src="/attached_assets/SIH P-1_LOGO_1759550517457.jpg" 
              alt="KSEBL Logo" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold">KSEBL</h1>
              <p className="text-xl font-semibold text-primary">LIFE LINE</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Real-time Power Grid Monitoring</h2>
          <p className="text-muted-foreground text-lg">
            AI-powered fault detection system for Kerala State Electricity Board's LT power distribution network. 
            Monitor grid health, detect line breaks, and coordinate field crews in real-time.
          </p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3 lg:hidden mb-4">
              <img 
                src="/attached_assets/SIH P-1_LOGO_1759550517457.jpg" 
                alt="KSEBL Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <CardTitle className="text-xl font-bold">KSEBL LIFE LINE</CardTitle>
              </div>
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the monitoring dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="operator@kerala.gov"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          data-testid="input-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-login"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
