
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'sonner';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll be in touch soon.");
    // Reset form - in a real app, you would send this data to a server
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-green-900/30 dark:via-blue-900/30 dark:to-indigo-900/30">
        <Header />

        <main className="flex-1 container-custom py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-muted-foreground text-lg mb-10">
              Have questions or feedback? We'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <a 
                          href="mailto:Abivarman1718@gmail.com" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          Abivarman1718@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-muted-foreground">+91 9876543210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-muted-foreground">
                          123 Healthcare Avenue<br />
                          Medical District<br />
                          Bengaluru, Karnataka 560001<br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                  <h2 className="text-2xl font-bold mb-4">Office Hours</h2>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Saturday:</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Sunday:</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="input-field"
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="input-field"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="input-field resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Contact;
