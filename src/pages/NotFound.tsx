
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6"
        >
          <div className="text-4xl font-bold text-primary">404</div>
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4 text-foreground">Page Not Found</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          We couldn't find the page you're looking for.
        </p>
        
        <Link to="/" className="button-primary inline-flex items-center">
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
