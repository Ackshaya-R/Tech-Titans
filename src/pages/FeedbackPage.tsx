
import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";

type FeedbackFormValues = {
  name: string;
  email: string;
  rating: string;
  usability: string;
  appPerformance: string;
  recommendation: string;
  suggestions: string;
};

const FeedbackPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      name: '',
      email: '',
      rating: '3',
      usability: 'good',
      appPerformance: 'good',
      recommendation: 'likely',
      suggestions: '',
    }
  });
  
  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here we'd typically send this data to a backend API
      // Since we're simulating email sending directly from frontend
      // (which isn't possible in a real app without a backend)
      // we'll just show a success message
      
      console.log('Feedback data to be sent:', {
        to: 'abivarmanagr1718@gmail.com', // Updated email address
        subject: `DocFinder Feedback from ${data.name}`,
        content: JSON.stringify(data, null, 2)
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thank you for your feedback! We appreciate your input.", {
        description: "Your feedback has been sent to our team."
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error("Failed to send feedback", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-green-900/30 dark:via-blue-900/30 dark:to-indigo-900/30">
        <Header />

        <main className="flex-1 container-custom py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Feedback</h1>
            <p className="text-muted-foreground text-lg mb-10">
              We value your feedback to improve our service. Please take a moment to share your thoughts.
            </p>
            
            <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-md">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" type="email" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Overall Rating */}
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Experience</FormLabel>
                        <FormDescription>
                          How would you rate your overall experience with DocFinder?
                        </FormDescription>
                        <div className="flex items-center space-x-2 pt-2">
                          <RadioGroup 
                            className="flex space-x-1" 
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            {[1, 2, 3, 4, 5].map((value) => (
                              <FormItem key={value} className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                                </FormControl>
                                <FormLabel htmlFor={`rating-${value}`} className="font-normal">
                                  {value}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                          <div className="ml-2">{renderStars(parseInt(field.value))}</div>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {/* App Usability */}
                  <FormField
                    control={form.control}
                    name="usability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>App Usability</FormLabel>
                        <FormDescription>
                          How easy was it to navigate and use the app?
                        </FormDescription>
                        <FormControl>
                          <RadioGroup 
                            className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2" 
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="poor" id="usability-poor" />
                              </FormControl>
                              <FormLabel htmlFor="usability-poor" className="font-normal">
                                Difficult to use
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="good" id="usability-good" />
                              </FormControl>
                              <FormLabel htmlFor="usability-good" className="font-normal">
                                Mostly intuitive
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="excellent" id="usability-excellent" />
                              </FormControl>
                              <FormLabel htmlFor="usability-excellent" className="font-normal">
                                Very easy to use
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* App Performance */}
                  <FormField
                    control={form.control}
                    name="appPerformance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>App Performance</FormLabel>
                        <FormDescription>
                          How would you rate the speed and reliability of the app?
                        </FormDescription>
                        <FormControl>
                          <RadioGroup 
                            className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2" 
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="poor" id="performance-poor" />
                              </FormControl>
                              <FormLabel htmlFor="performance-poor" className="font-normal">
                                Slow or buggy
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="good" id="performance-good" />
                              </FormControl>
                              <FormLabel htmlFor="performance-good" className="font-normal">
                                Mostly smooth
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="excellent" id="performance-excellent" />
                              </FormControl>
                              <FormLabel htmlFor="performance-excellent" className="font-normal">
                                Fast and reliable
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Recommendation */}
                  <FormField
                    control={form.control}
                    name="recommendation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommendation</FormLabel>
                        <FormDescription>
                          How likely are you to recommend DocFinder to others?
                        </FormDescription>
                        <FormControl>
                          <RadioGroup 
                            className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2" 
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="unlikely" id="recommendation-unlikely" />
                              </FormControl>
                              <FormLabel htmlFor="recommendation-unlikely" className="font-normal">
                                Unlikely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="maybe" id="recommendation-maybe" />
                              </FormControl>
                              <FormLabel htmlFor="recommendation-maybe" className="font-normal">
                                Maybe
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="likely" id="recommendation-likely" />
                              </FormControl>
                              <FormLabel htmlFor="recommendation-likely" className="font-normal">
                                Very likely
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Suggestions */}
                  <FormField
                    control={form.control}
                    name="suggestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestions for Improvement</FormLabel>
                        <FormDescription>
                          What features or improvements would you like to see in DocFinder?
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Your suggestions and comments..."
                            className="resize-none"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2" />
                        Submit Feedback
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default FeedbackPage;
