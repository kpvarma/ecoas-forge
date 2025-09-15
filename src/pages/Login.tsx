import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield } from "lucide-react";
export function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    // For now, just navigate to dashboard
    navigate("/dashboard");
  };
  return <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">eCoA Service</h1>
          <p className="text-muted-foreground">Enterprise Certificate of Analysis Management</p>
        </div>

        {/* Login Card */}
        <Card className="enterprise-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Please sign in to continue to your dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleLogin} className="w-full h-12 text-base font-medium" size="lg">
              <Shield className="h-5 w-5 mr-3" />
              Login with Entegris SSO
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Secure access powered by enterprise single sign-on
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 Entegris. All rights reserved.</p>
        </div>
      </div>
    </div>;
}