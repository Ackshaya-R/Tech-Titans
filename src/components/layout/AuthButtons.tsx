import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { toast } from "sonner";

const AuthButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    // Check login status from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, [location.pathname]); // Re-check when route changes
  
  const handleLogout = () => {
    // Remove login status from localStorage, but keep user registration data
    localStorage.removeItem('isLoggedIn');
    
    // Update state
    setIsLoggedIn(false);
    setUserName(null);
    setShowDropdown(false);
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Navigate to home page
    navigate('/');
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (isLoggedIn && userName) {
    return (
      <div className="relative">
        <button 
          onClick={toggleDropdown}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-background/10 hover:bg-background/20 text-foreground transition"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="font-medium hidden sm:inline">{userName}</span>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-10">
            <div className="py-1">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm hover:bg-muted"
                onClick={() => setShowDropdown(false)}
              >
                Your Profile
              </Link>
              <Link 
                to="/appointments" 
                className="block px-4 py-2 text-sm hover:bg-muted"
                onClick={() => setShowDropdown(false)}
              >
                Your Appointments
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
              >
                <div className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Check current route
  const isSignInPage = location.pathname === '/sign-in';
  const isSignUpPage = location.pathname === '/sign-up';
  
  return (
    <div className="flex space-x-2">
      {!isSignInPage && (
        <Link 
          to="/sign-in" 
          className="px-4 py-2 text-sm rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition"
        >
          Sign In
        </Link>
      )}
      
      {!isSignUpPage && (
        <Link 
          to="/sign-up" 
          className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition"
        >
          Sign Up
        </Link>
      )}
    </div>
  );
};

export default AuthButtons;
