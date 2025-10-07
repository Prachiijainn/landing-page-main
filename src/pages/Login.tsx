import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Check if user was redirected here from project upload
  const redirectUrl = localStorage.getItem('redirectAfterLogin');
  const isRedirectedFromUpload = redirectUrl === '/projects';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log('🚀 Starting login process...');

    try {
      const result = await login(loginData.email, loginData.password);
      console.log('📝 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful');
        
        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          console.log('🔄 Redirecting to stored URL:', redirectUrl);
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl);
        } else {
          console.log('🏠 Redirecting to default /projects');
          navigate("/projects");
        }
      } else {
        console.error('❌ Login failed:', result.error);
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      setError("An error occurred during login");
    } finally {
      console.log('🏁 Login process completed');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signup(signupData.email, signupData.password, signupData.name);
      if (result.success) {
        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          console.log('🔄 Signup successful, redirecting to stored URL:', redirectUrl);
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl);
        } else {
          setSuccess("Account created successfully! You can now submit projects.");
          setSignupData({ email: "", password: "", name: "" });
          // Redirect to projects after a short delay
          setTimeout(() => navigate("/projects"), 2000);
        }
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (error) {
      setError("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-soft-steel">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-tech-midnight-ink">
                  {isRedirectedFromUpload ? "Sign In to Submit Project" : "Welcome to NaedeX"}
                </CardTitle>
                <p className="text-tech-graphite">
                  {isRedirectedFromUpload 
                    ? "Please sign in or create an account to submit your project"
                    : "Sign in to your account or create a new one"
                  }
                </p>
              </CardHeader>
              <CardContent>
                {isRedirectedFromUpload && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Ready to submit your project?</strong> Sign in or create an account to share your work with the community!
                    </p>
                  </div>
                )}
                <Tabs defaultValue="login" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 ">
                      <div>
                        <div className= "text-black" >
                        <Label htmlFor="login-email">Email</Label></div>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@example.com"
                          className="text-tech-midnight-ink font-medium"
                          required
                        />
                      </div>

                      <div>
                        <div className="text-black">
                        <Label htmlFor="login-password">Password</Label></div>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          className="text-tech-midnight-ink font-medium"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-tech-neo-blue hover:bg-tech-neo-blue/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div><div className="text-black">
                        <Label htmlFor="signup-name">Full Name</Label></div>
                        <Input
                          id="signup-name"
                          type="text"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your full name"
                          className="text-tech-midnight-ink font-medium"
                          required
                        />
                      </div>

                      <div><div className="text-black">
                        <Label htmlFor="signup-email">Email</Label></div>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@example.com"
                          className="text-tech-midnight-ink font-medium"
                          required
                        />
                      </div>

                      <div><div className="text-black">
                        <Label htmlFor="signup-password">Password</Label></div>
                        <Input
                          id="signup-password"
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Create a password"
                          className="text-tech-midnight-ink font-medium"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-tech-neo-blue hover:bg-tech-neo-blue/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {error && (
                  <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
                )}

                {success && (
                  <div className="mt-4 text-green-600 text-sm text-center">{success}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;