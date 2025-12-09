import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Clock, Mail, Lock, User, BarChart3, Brain, Timer } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.png';
import timeManagement from '@/assets/time-management.png';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
      });
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName || email.split('@')[0]);
      navigate('/dashboard');
      toast({
        title: '🎉 Account created!',
        description: 'Come Join With Me! Let\'s track your time together.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message || 'Could not create account',
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Timer,
      title: 'Smart Tracking',
      description: 'Log activities in hours or minutes with ease',
      color: 'from-primary to-primary/60',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Beautiful charts to visualize your day',
      color: 'from-accent to-accent/60',
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Get personalized productivity tips',
      color: 'from-info to-info/60',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-info/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-8 xl:p-12">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl gradient-primary shadow-glow">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold gradient-text">TimeTrack AI</h1>
                <p className="text-sm text-muted-foreground">Smart daily time management</p>
              </div>
            </div>

            <h2 className="text-4xl xl:text-5xl font-display font-bold text-foreground leading-tight">
              Track Your Time <br />
              <span className="gradient-text">With Me</span> ✨
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Master your daily schedule with intelligent time tracking. Log up to 1440 minutes with beautiful analytics and AI-powered insights.
            </p>

            {/* Hero Image */}
            <div className="relative mt-6 rounded-2xl overflow-hidden shadow-2xl border border-border/30">
              <img 
                src={heroDashboard} 
                alt="TimeTrack Dashboard Preview" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="group p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} w-fit mb-3`}>
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md animate-fade-in">
            {/* Mobile Header */}
            <div className="lg:hidden flex flex-col items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl gradient-primary shadow-glow">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-display font-bold gradient-text">Track Your Time With Me ✨</h1>
                <p className="text-sm text-muted-foreground">Smart daily time management</p>
              </div>
              <img 
                src={timeManagement} 
                alt="Time Management" 
                className="w-48 h-48 object-contain"
              />
            </div>

            <Card className="shadow-2xl border-border/50 bg-card/80 backdrop-blur-xl">
              <Tabs defaultValue="signin" className="w-full">
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <TabsContent value="signin" className="mt-0 space-y-4">
                    <div className="text-center">
                      <CardTitle className="text-xl">Welcome back! 👋</CardTitle>
                      <CardDescription className="mt-1">
                        Sign in to continue tracking your time
                      </CardDescription>
                    </div>
                    
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 border-border/50 focus:border-primary transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 border-border/50 focus:border-primary transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary hover:opacity-90 shadow-glow hover:shadow-glow-lg transition-all duration-300 font-semibold" 
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Sign In →'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0 space-y-4">
                    <div className="text-center">
                      <CardTitle className="text-xl">Come Join With Me! 🎉</CardTitle>
                      <CardDescription className="mt-1">
                        Start tracking your time with AI insights
                      </CardDescription>
                    </div>
                    
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Your Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="What should I call you?"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="pl-10 border-border/50 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 border-border/50 focus:border-primary transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 border-border/50 focus:border-primary transition-colors"
                            required
                            minLength={6}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Must be at least 6 characters
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary hover:opacity-90 shadow-glow hover:shadow-glow-lg transition-all duration-300 font-semibold" 
                        disabled={loading}
                      >
                        {loading ? 'Creating account...' : 'Create Account 🚀'}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Track up to 1440 minutes daily with intelligent insights ⏱️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}