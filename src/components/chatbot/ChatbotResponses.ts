
// Bot response mapping
export const getBotResponse = (message: string): string => {
  // Convert to lowercase for easier matching
  const input = message.toLowerCase();
  
  // Doctor recommendation questions
  if (input.includes('recommend') && (input.includes('doctor') || input.includes('specialist'))) {
    return "You can use our new AI Symptom Analyzer to get personalized doctor recommendations! Just go to the Doctors page and click on the 'AI Symptom Analysis' tab.";
  }
  
  // Symptom analysis questions
  if (input.includes('symptom') || (input.includes('analyze') && input.includes('symptom'))) {
    return "Our new AI Symptom Analyzer can help you find the right specialist based on your symptoms. Visit the Doctors page and click on 'AI Symptom Analysis'.";
  }
  
  // AI feature questions
  if ((input.includes('ai') || input.includes('artificial intelligence')) && (input.includes('feature') || input.includes('function'))) {
    return "DocFinder now features AI-powered doctor recommendations! Our symptom analyzer can match your symptoms with the right medical specialist, and our recommendation engine helps find the best doctor for your needs.";
  }
  
  // Book appointment questions
  if (input.includes('book') && input.includes('appointment')) {
    return "To book an appointment, first search for a doctor by specialty or use our AI symptom analyzer, then click on the doctor's card and select 'Book Appointment'.";
  }
  
  // Location questions
  if (input.includes('location') || input.includes('area') || input.includes('city')) {
    return "DocFinder helps you find doctors in your area. Start by entering your location on the home page, then browse available doctors in your vicinity.";
  }
  
  // Emergency questions
  if (input.includes('emergency')) {
    return "For medical emergencies, you can use our Emergency Booking page to quickly find available doctors for same-day appointments. In case of severe emergencies, please call emergency services immediately.";
  }
  
  // Payment questions
  if (input.includes('payment') || input.includes('cost') || input.includes('fee')) {
    return "Doctor consultation fees are displayed on each doctor's profile. We accept various payment methods including credit/debit cards and mobile payments at the time of your visit.";
  }
  
  // Cancellation questions
  if (input.includes('cancel') || input.includes('reschedule')) {
    return "You can cancel or reschedule your appointment through your appointment confirmation email or by calling the doctor's office directly.";
  }
  
  // What is DocFinder
  if (input.includes('what is') && (input.includes('docfinder') || input.includes('this app'))) {
    return "DocFinder is an AI-powered doctor appointment booking platform that helps patients find the right specialists based on their symptoms, location, and preferences.";
  }
  
  // Default responses for common greetings
  if (input.includes('hello') || input.includes('hi ') || input === 'hi') {
    return "Hello! How can I help you with DocFinder today?";
  }
  
  if (input.includes('thank')) {
    return "You're welcome! Is there anything else you'd like to know about DocFinder?";
  }
  
  if (input.includes('bye')) {
    return "Goodbye! Feel free to chat again if you have more questions.";
  }
  
  // Default response
  return "I'm DocFinder's assistant. I can help you find doctors, book appointments, or answer questions about our services. We now have AI-powered symptom analysis to recommend the right specialist for you!";
};
