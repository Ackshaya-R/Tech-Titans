
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  MapPin, 
  Search, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  LogIn,
  UserPlus
} from 'lucide-react';

import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import LocationForm from '@/components/location/LocationForm';
import { LocationType } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Try to get saved location from localStorage
    if (loggedIn) {
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        try {
          setLocation(JSON.parse(savedLocation));
        } catch (error) {
          console.error('Error parsing location from localStorage', error);
        }
      }
    }
  }, []);
  
  const handleLocationSubmit = (locationData: LocationType) => {
    // Save location to localStorage
    localStorage.setItem('selectedLocation', JSON.stringify(locationData));
    setLocation(locationData);
    
    // Navigate to doctors page
    navigate('/doctors', { state: { locationData } });
  };

  const handleEmergencyBooking = () => {
    navigate('/emergency');
  };

  // Animation variants
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
  
  // Landing page when not logged in
  if (!isLoggedIn) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-200 via-indigo-100 to-purple-200 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
          <Header />
          
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <motion.div 
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  DocFinder
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300">
                  Find and book doctor appointments in real-time
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link 
                  to="/sign-in" 
                  className="button-primary group py-3 px-6 flex items-center justify-center"
                >
                  <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-[-2px] transition-transform" />
                  Sign In
                </Link>
                
                <Link 
                  to="/sign-up" 
                  className="button-secondary group py-3 px-6 flex items-center justify-center"
                >
                  <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Sign Up
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 text-center p-4 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              &copy; {new Date().getFullYear()} DocFinder. All rights reserved.
            </motion.div>
          </main>
        </div>
      </PageTransition>
    );
  }
  
  // Original content when logged in
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-950">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 -z-10" />
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 -z-10" />
            
            <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Find and Book Doctor Appointments in Real-Time
                </motion.h1>
                
                <motion.p 
                  className="mt-4 text-lg text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Connect with the best doctors near you with our AI-powered 
                  doctor finder and appointment booking system.
                </motion.p>
                
                <motion.div 
                  className="mt-8 space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <LocationForm onSubmit={handleLocationSubmit} initialLocation={location} />
                  
                  {location && (
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={handleEmergencyBooking}
                        className="button-emergency flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Booking
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
              
              <motion.div 
                className="order-1 lg:order-2 flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/lovable-uploads/c1fa4a80-affa-40a5-ad7b-c5a5ad7ef9af.png" 
                  alt="India map with location pins" 
                  className="w-full max-w-md rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-16 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">How It Works</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Our platform makes it easy to find the right doctor and book 
                  appointments in just a few simple steps.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="bg-background rounded-xl p-6 shadow-sm border border-border"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Enter Your Location</h3>
                  <p className="text-muted-foreground">
                    Share your location to find doctors available in your area.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-background rounded-xl p-6 shadow-sm border border-border"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Choose a Doctor</h3>
                  <p className="text-muted-foreground">
                    Browse through our list of qualified doctors and select the one that meets your needs.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-background rounded-xl p-6 shadow-sm border border-border"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
                  <p className="text-muted-foreground">
                    Select a convenient time slot and book your appointment instantly.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Benefits Section */}
          <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Why Choose Us</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Our platform offers several benefits to make your healthcare experience better.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Verified Doctors</h3>
                    <p className="text-muted-foreground">
                      All doctors on our platform are verified professionals with valid credentials.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
                    <p className="text-muted-foreground">
                      Book appointments instantly without waiting for confirmation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h3>
                    <p className="text-muted-foreground">
                      Our AI system recommends the best doctors based on your specific needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Wait Time Estimation</h3>
                    <p className="text-muted-foreground">
                      Get accurate estimates of doctor wait times to plan your visit better.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Need immediate assistance?</h3>
                <button 
                  onClick={handleEmergencyBooking}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center mx-auto"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Book Emergency Appointment
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default Index;
