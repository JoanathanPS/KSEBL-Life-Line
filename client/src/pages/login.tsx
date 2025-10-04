import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    setLocation("/");
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@kerala.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-login">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
