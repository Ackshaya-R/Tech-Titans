
import { ExternalLink, Users, Clock, Book, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-green-900/30 dark:via-blue-900/30 dark:to-indigo-900/30">
        <Header />

        <main className="flex-1 container-custom py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section with Image - Adjusted height to show all faces */}
            <div className="mb-12 overflow-hidden rounded-xl">
              <img 
                src="/lovable-uploads/dc194c12-c95c-4173-b315-1b1274000200.png" 
                alt="Healthcare Professionals Team" 
                className="w-full object-contain h-[500px]" 
              />
            </div>

            <h1 className="text-4xl font-bold mb-6 text-center">About DocFinder</h1>
            
            <div className="space-y-12">
              {/* App Description */}
              <section className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-xl text-muted-foreground">
                  DocFinder is a revolutionary healthcare appointment booking platform designed to connect patients with the right healthcare professionals quickly and efficiently. Our mission is to make healthcare accessible to everyone by simplifying the appointment booking process.
                </p>
              </section>

              {/* Advantages */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Advantages of DocFinder</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                    <div className="flex items-start mb-4">
                      <Clock className="w-6 h-6 text-primary mr-3 mt-1" />
                      <h3 className="text-xl font-semibold">Fast Appointment Booking</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Book appointments with just a few clicks, saving time and reducing the hassle of phone calls and waiting.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                    <div className="flex items-start mb-4">
                      <Users className="w-6 h-6 text-primary mr-3 mt-1" />
                      <h3 className="text-xl font-semibold">Find the Right Doctor</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Search for doctors based on specialty, location, and availability to find the perfect match for your healthcare needs.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                    <div className="flex items-start mb-4">
                      <ExternalLink className="w-6 h-6 text-primary mr-3 mt-1" />
                      <h3 className="text-xl font-semibold">Emergency Booking</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Priority booking for emergency cases, ensuring you get the care you need when time is of the essence.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                    <div className="flex items-start mb-4">
                      <Heart className="w-6 h-6 text-primary mr-3 mt-1" />
                      <h3 className="text-xl font-semibold">Patient-Centric Approach</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Designed with patients in mind, our platform ensures a seamless and stress-free healthcare experience.
                    </p>
                  </div>
                </div>
              </section>

              {/* Blog Post */}
              <section className="bg-white/80 dark:bg-slate-800/80 p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4">Transforming Healthcare Access in the Digital Age</h2>
                <div className="flex items-center mb-6 text-muted-foreground">
                  <Book className="w-4 h-4 mr-2" />
                  <span className="mr-4">Blog Post</span>
                  <span>Published: June 15, 2023</span>
                </div>
                
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p>
                    In today's fast-paced world, access to quality healthcare should be simple and efficient. DocFinder was born from a vision to eliminate the barriers between patients and healthcare providers, creating a seamless connection that benefits everyone involved.
                  </p>
                  
                  <p>
                    Our platform leverages cutting-edge technology to match patients with the right healthcare professionals based on their specific needs, location, and availability. By digitizing the appointment booking process, we've significantly reduced wait times and administrative overhead, allowing doctors to focus on what they do best: providing excellent care.
                  </p>
                  
                  <p>
                    What sets DocFinder apart is our commitment to accessibility. We've designed our platform to be intuitive and user-friendly, ensuring that patients of all ages and technical abilities can navigate it with ease. Our emergency booking feature provides peace of mind, knowing that urgent healthcare needs can be addressed promptly.
                  </p>
                  
                  <p>
                    As we continue to grow and evolve, our mission remains constant: to make healthcare accessible to everyone, everywhere. We're proud of the positive impact we've had on countless patients' lives and look forward to continuing this journey of healthcare transformation.
                  </p>
                  
                  <p>
                    Join us in revolutionizing healthcare access—one appointment at a time.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default About;
