
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  
  // Check login status
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, [location.pathname]); // Re-check when route changes
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Handle scroll locking for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Feedback', path: '/feedback' }, // Added Feedback link
  ];

  // Check if we're on the index page
  const isIndexPage = location.pathname === '/';
  
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80 border-b border-border/40">
      <div className="container-custom mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold text-foreground flex items-center"
          >
            <span className="text-primary">Doc</span>
            <span>Finder</span>
          </Link>
        </div>
        
        {/* Desktop Navigation - Only show when logged in */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex space-x-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`px-2 py-1 rounded-md text-foreground/80 hover:text-foreground transition-colors ${
                      location.pathname === link.path ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        
        {/* Only display AuthButtons if NOT on index page */}
        {!isIndexPage && (
          <div className="hidden md:flex items-center">
            <AuthButtons />
          </div>
        )}
        
        {/* Mobile Menu Button - Only show when logged in */}
        {isLoggedIn ? (
          <button 
            className="md:hidden flex items-center text-foreground"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        ) : (
          !isIndexPage && (
            <div className="md:hidden">
              <AuthButtons />
            </div>
          )
        )}
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && isLoggedIn && (
          <motion.div 
            className="fixed inset-0 top-16 z-30 bg-background md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container-custom mx-auto py-6 flex flex-col h-full">
              <ul className="space-y-4 mb-6">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`block px-4 py-2 text-lg rounded-md ${
                        location.pathname === link.path 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Only show auth buttons in mobile menu if not on index page */}
              {!isIndexPage && (
                <div className="mt-auto px-4 py-4 border-t border-border">
                  <AuthButtons />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
