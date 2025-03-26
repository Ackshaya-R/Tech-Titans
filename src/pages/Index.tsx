
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import LocationForm from '@/components/location/LocationForm';
import PageTransition from '@/components/ui/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Find the Right Doctor,<br />Book with Ease
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Connect with trusted healthcare professionals and schedule appointments seamlessly
              </motion.p>
            </motion.div>
            
            <LocationForm />
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Index;
