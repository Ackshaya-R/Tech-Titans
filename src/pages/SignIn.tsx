
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Check if user has signed up before
  useEffect(() => {
    const hasSignedUp = localStorage.getItem('hasSignedUp') === 'true';
    
    // If user hasn't signed up, redirect to sign-up page
    if (!hasSignedUp) {
      toast.info("Please sign up first to create an account");
      navigate('/sign-up');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }
      
      // Check if the email exists in localStorage
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail !== formData.email) {
        toast.error("Account not found. Please sign up first.");
        setIsLoading(false);
        setTimeout(() => {
          navigate('/sign-up');
        }, 1500);
        return;
      }
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      toast.success("Login successful!");
      
      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-950">
        <Header />
        
        <main className="flex-1 container-custom py-12 flex items-center justify-center">
          <motion.div 
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="glass-card backdrop-blur-md bg-white/80 dark:bg-gray-900/70 p-8 shadow-xl"
              variants={itemVariants}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground mt-1">Sign in to your account</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>
                
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-between"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`button-primary w-full flex items-center justify-center ${isLoading ? 'opacity-70' : ''}`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              
                <motion.div 
                  className="mt-6 text-center text-sm"
                  variants={itemVariants}
                >
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
};

export default SignIn;
