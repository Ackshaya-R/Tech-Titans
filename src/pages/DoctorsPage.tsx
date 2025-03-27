
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Activity } from 'lucide-react';
import Header from '@/components/layout/Header';
import DoctorsList from '@/components/doctors/DoctorsList';
import SymptomAnalyzer from '@/components/doctors/SymptomAnalyzer';
import PageTransition from '@/components/ui/PageTransition';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LocationType } from '@/data/mockData';

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Gynecologist",
  "Ophthalmologist",
  "General Physician"
];

const DoctorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationData = location.state?.locationData as LocationType;
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All Specialties");
  const [activeTab, setActiveTab] = useState("browse");
  
  // Redirect to home if location data is not available
  useEffect(() => {
    if (!locationData) {
      // Try to get location from localStorage as backup
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          console.log("Using saved location from localStorage:", parsedLocation);
          // Do not redirect, use the saved location instead
          return;
        } catch (error) {
          console.error('Error parsing location from localStorage', error);
        }
      }
      
      console.log("No location data available, redirecting to home");
      navigate('/', { replace: true });
    }
  }, [locationData, navigate]);
  
  // Get the locationData from localStorage if it's not in the state
  const effectiveLocationData = locationData || 
    (typeof localStorage !== 'undefined' && localStorage.getItem('selectedLocation') 
      ? JSON.parse(localStorage.getItem('selectedLocation') || '{}') 
      : null);
  
  if (!effectiveLocationData) {
    return null;
  }

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
  };
  
  const handleSpecialtyRecommended = (specialty: string) => {
    // Find the matching specialty from our list or default to "All Specialties"
    const matchedSpecialty = specialties.find(s => 
      s === specialty || s.includes(specialty) || specialty.includes(s)
    ) || "All Specialties";
    
    setSelectedSpecialty(matchedSpecialty);
    // Switch to browse tab to show the filtered doctors
    setActiveTab("browse");
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container-custom py-12">
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Location
            </button>
          </div>
          
          <div className="max-w-4xl mx-auto mb-6">
            <h1 className="text-3xl font-bold mb-2">Find Doctors</h1>
            <p className="text-muted-foreground">
              Showing doctors in {effectiveLocationData.area}, {effectiveLocationData.district}, {effectiveLocationData.state}, {effectiveLocationData.country}
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="browse">Browse by Specialty</TabsTrigger>
                <TabsTrigger value="analyze" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  AI Symptom Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse">
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter by specialty:</span>
                  </div>
                  <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <DoctorsList locationData={effectiveLocationData} specialty={selectedSpecialty === "All Specialties" ? undefined : selectedSpecialty} />
              </TabsContent>
              
              <TabsContent value="analyze">
                <SymptomAnalyzer 
                  locationData={effectiveLocationData} 
                  onSpecialtyRecommended={handleSpecialtyRecommended}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default DoctorsPage;
