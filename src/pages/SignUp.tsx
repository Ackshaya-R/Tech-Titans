
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, AlertCircle, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { z } from "zod";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  }>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    agreeToTerms: false
  });
  
  const captchaRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password)
    });
  };

  const isPasswordStrong = () => {
    const { minLength, hasUppercase, hasLowercase, hasNumber } = passwordStrength;
    return minLength && hasUppercase && hasLowercase && hasNumber;
  };

  const generateCaptcha = () => {
    setShowCaptcha(true);
    // Generate a random 6-digit OTP
    setOtpValue("");
  };

  const handleCaptchaComplete = (value: string) => {
    if (value.length === 6) {
      setCaptchaVerified(true);
      setShowCaptcha(false);
      toast.success("Verification successful!");
    }
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }
      
      if (!formData.agreeToTerms) {
        toast.error("You must agree to the terms and conditions");
        setIsLoading(false);
        return;
      }
      
      // Mobile validation
      if (!validateMobile(formData.mobile)) {
        toast.error("Please enter a valid 10-digit mobile number");
        setIsLoading(false);
        return;
      }
      
      // Password strength check
      if (!isPasswordStrong()) {
        toast.error("Password does not meet the requirements");
        setIsLoading(false);
        return;
      }
      
      // CAPTCHA verification
      if (!captchaVerified) {
        setShowCaptcha(true);
        setIsLoading(false);
        return;
      }
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful registration
      toast.success("Account created successfully!");
      
      // Store user info in localStorage
      localStorage.setItem('hasSignedUp', 'true');
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userMobile', formData.mobile);
      
      // Redirect to sign-in page
      toast.info("Please sign in with your new account");
      navigate('/sign-in');
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
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
              className="glass-card p-8"
              variants={itemVariants}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Create Your Account</h1>
                <p className="text-muted-foreground mt-1">Join us to find and book healthcare services</p>
              </div>
              
              {showCaptcha ? (
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="text-lg font-medium mb-3">Verify you're not a robot</h2>
                    <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit code below</p>
                    
                    <div className="flex justify-center mb-6">
                      <InputOTP 
                        maxLength={6} 
                        value={otpValue} 
                        onChange={(value) => {
                          setOtpValue(value);
                          handleCaptchaComplete(value);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowCaptcha(false)}
                      className="text-primary hover:underline text-sm"
                    >
                      Back to sign up
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input 
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>
                  
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
                    <label htmlFor="mobile" className="text-sm font-medium">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input 
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="input-field pl-10"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a 10-digit mobile number without country code
                    </p>
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
                    
                    <div className="space-y-2 mt-2">
                      <div className="text-xs font-medium">Password must contain:</div>
                      <ul className="space-y-1">
                        <li className="text-xs flex items-center">
                          {passwordStrength.minLength ? 
                            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />}
                          At least 8 characters
                        </li>
                        <li className="text-xs flex items-center">
                          {passwordStrength.hasUppercase ? 
                            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />}
                          At least one uppercase letter (A-Z)
                        </li>
                        <li className="text-xs flex items-center">
                          {passwordStrength.hasLowercase ? 
                            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />}
                          At least one lowercase letter (a-z)
                        </li>
                        <li className="text-xs flex items-center">
                          {passwordStrength.hasNumber ? 
                            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />}
                          At least one number (0-9)
                        </li>
                        <li className="text-xs flex items-center">
                          {passwordStrength.hasSpecial ? 
                            <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                            <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />}
                          At least one special character (Optional)
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                  
                  <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                    <Checkbox 
                      id="verify"
                      checked={captchaVerified}
                      onCheckedChange={() => {
                        if (!captchaVerified) {
                          generateCaptcha();
                        }
                      }}
                    />
                    <label
                      htmlFor="verify"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I'm not a robot
                    </label>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start mt-4"
                    variants={itemVariants}
                  >
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-700">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
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
                          Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                
                  <motion.div 
                    className="mt-6 text-center text-sm"
                    variants={itemVariants}
                  >
                    Already have an account?{' '}
                    <Link to="/sign-in" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </motion.div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
};

export default SignUp;
