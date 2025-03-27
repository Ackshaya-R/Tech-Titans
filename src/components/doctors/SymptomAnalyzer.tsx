
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Doctor, LocationType, getDoctors } from '@/data/mockData';
import { 
  analyzeSymptoms, 
  getAIRecommendedDoctors, 
  generateAIRecommendationExplanation 
} from '@/utils/aiRecommendationUtils';
import DoctorCard from './DoctorCard';

interface SymptomAnalyzerProps {
  locationData: LocationType;
  onSpecialtyRecommended?: (specialty: string) => void;
}

const SymptomAnalyzer = ({ locationData, onSpecialtyRecommended }: SymptomAnalyzerProps) => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [recommendedSpecialty, setRecommendedSpecialty] = useState('');
  const [explanation, setExplanation] = useState('');
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (symptoms.trim().length < 3) {
      toast({
        title: "Please enter more details",
        description: "Describe your symptoms in more detail for better recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Get all doctors for the location
      const allDoctors = getDoctors(locationData);
      
      // Get AI recommendations
      const { doctors, recommendedSpecialty, confidence } = getAIRecommendedDoctors(
        allDoctors,
        symptoms,
        locationData
      );
      
      // Generate explanation
      const aiExplanation = generateAIRecommendationExplanation(
        recommendedSpecialty,
        confidence,
        symptoms
      );
      
      // Update state
      setRecommendedDoctors(doctors.slice(0, 5)); // Show top 5 recommendations
      setRecommendedSpecialty(recommendedSpecialty);
      setExplanation(aiExplanation);
      setIsAnalyzing(false);
      
      // Notify parent component of specialty recommendation
      if (onSpecialtyRecommended) {
        onSpecialtyRecommended(recommendedSpecialty);
      }
      
      // Show success toast
      toast({
        title: "AI Analysis Complete",
        description: `Based on your symptoms, we recommend seeing a ${recommendedSpecialty}.`,
      });
    }, 1500); // Simulate AI processing delay
  };

  return (
    <div className="w-full bg-white dark:bg-background rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <Stethoscope className="text-primary w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">AI Symptom Analyzer</h2>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Describe your symptoms and our AI will recommend the right specialist for you.
      </p>
      
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., fever, cough, headache, joint pain"
              className="w-full p-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isAnalyzing}
            />
            <Search className="absolute right-3 top-3 text-muted-foreground w-5 h-5" />
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={symptoms.trim().length < 3 || isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>
      
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <div className="flex items-center mb-2">
            <Activity className="text-primary w-5 h-5 mr-2" />
            <h3 className="font-semibold">AI Recommendation</h3>
          </div>
          <p>{explanation}</p>
        </motion.div>
      )}
      
      {recommendedDoctors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold mb-4 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-primary" />
            Recommended Doctors ({recommendedDoctors.length})
          </h3>
          <div className="space-y-4">
            {recommendedDoctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                locationData={locationData}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SymptomAnalyzer;
