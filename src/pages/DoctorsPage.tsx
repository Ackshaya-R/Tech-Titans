
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import DoctorsList from '@/components/doctors/DoctorsList';
import PageTransition from '@/components/ui/PageTransition';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const locationData = location.state?.location as LocationType;
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All Specialties");
  
  // Redirect to home if location data is not available
  useEffect(() => {
    if (!locationData) {
      navigate('/', { replace: true });
    }
  }, [locationData, navigate]);
  
  if (!locationData) {
    return null;
  }

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
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
              Showing doctors in {locationData.area}, {locationData.district}, {locationData.state}, {locationData.country}
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
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
          
          <DoctorsList locationData={locationData} specialty={selectedSpecialty === "All Specialties" ? undefined : selectedSpecialty} />
        </main>
      </div>
    </PageTransition>
  );
};

export default DoctorsPage;
