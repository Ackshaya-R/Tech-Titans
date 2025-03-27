export interface LocationType {
  area: string;
  district: string;
  state: string;
  country: string;
}

export const getAvailableLocations = () => {
  // Create a mapping of states to their authentic districts
  const stateToDistricts: Record<string, string[]> = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Khasi Hills", "East Jaintia Hills", "East Garo Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Jaintia Hills", "West Khasi Hills", "West Garo Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambal"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Anantnag", "Bandipore", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
  };

  // Create a mapping of districts to their real areas/neighborhoods
  const districtToAreas: Record<string, string[]> = {
    // Major metropolitan cities with real neighborhoods
    "Bengaluru Urban": ["Koramangala", "Indiranagar", "Jayanagar", "Whitefield", "Electronic City", "BTM Layout", "HSR Layout", "Malleswaram", "Rajajinagar", "JP Nagar"],
    "Mumbai City": ["Colaba", "Dongri", "Marine Lines", "Mahalaxmi", "Worli", "Prabhadevi", "Dadar", "Byculla", "Mumbai Central", "Malabar Hill"],
    "Mumbai Suburban": ["Andheri", "Bandra", "Borivali", "Kandivali", "Malad", "Goregaon", "Jogeshwari", "Powai", "Ghatkopar", "Kurla"],
    "Chennai": ["T Nagar", "Adyar", "Anna Nagar", "Mylapore", "Velachery", "Besant Nagar", "Nungambakkam", "Egmore", "Royapettah", "Kilpauk"],
    "Hyderabad": ["Banjara Hills", "Jubilee Hills", "HITEC City", "Gachibowli", "Madhapur", "Secunderabad", "Kukatpally", "Ameerpet", "Begumpet", "Miyapur"],
    "Kolkata": ["Park Street", "Ballygunge", "Salt Lake City", "New Town", "Alipore", "Bhawanipur", "Gariahat", "Tollygunge", "Jadavpur", "Dum Dum"],
    "New Delhi": ["Connaught Place", "Karol Bagh", "Chandni Chowk", "Paharganj", "Daryaganj", "Jhandewalan", "Rajendra Place", "Patel Nagar", "Rajouri Garden", "Lajpat Nagar"],
    "Gurugram": ["DLF City", "Sushant Lok", "Sector 14", "Sector 15", "Sector 29", "Sector 44", "Golf Course Road", "MG Road", "Udyog Vihar", "Cyber City"],
    "Pune": ["Koregaon Park", "Kalyani Nagar", "Viman Nagar", "Kothrud", "Aundh", "Baner", "Hadapsar", "Magarpatta", "Hinjewadi", "Wakad"],
    "Ahmedabad": ["Navrangpura", "Satellite", "Bodakdev", "Vastrapur", "Paldi", "Maninagar", "Ellis Bridge", "Naranpura", "Thaltej", "Gota"],

    // For other districts, provide placeholder areas that can be updated later
    "default": ["Central Area", "North Area", "South Area", "East Area", "West Area"]
  };

  // Function to get areas for a district
  const getAreasForDistrict = (district: string): string[] => {
    return districtToAreas[district] || districtToAreas["default"];
  };
  
  // Flatten the district list
  const allDistricts: string[] = Object.values(stateToDistricts).flat();
  
  // Create areas list
  const allAreas: string[] = Object.values(districtToAreas).flat();
  
  return {
    areas: allAreas,
    districts: allDistricts,
    states: Object.keys(stateToDistricts),
    countries: ["India"],
    stateToDistricts,
    districtToAreas,
    getAreasForDistrict
  };
};

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  clinic: string;
  address: string;
  available: boolean;
  availableDays: string[];
  rating: number;
  reviews: number;
  fee: number;
  experience: number;
  image: string;
  waitTime?: number; // in minutes
}

// Specialty data with icons and descriptions
export const specialties = [
  {
    id: "Cardiologist",
    name: "Cardiologist",
    icon: "❤️",
    description: "Heart specialists treating cardiovascular conditions"
  },
  {
    id: "Dermatologist",
    name: "Dermatologist",
    icon: "🧬",
    description: "Skin, hair and nail specialists"
  },
  {
    id: "Neurologist",
    name: "Neurologist",
    icon: "🧠",
    description: "Brain and nervous system specialists"
  },
  {
    id: "Orthopedic",
    name: "Orthopedic",
    icon: "🦴",
    description: "Bone and joint specialists"
  },
  {
    id: "Pediatrician",
    name: "Pediatrician",
    icon: "👶",
    description: "Child health specialists"
  },
  {
    id: "Psychiatrist",
    name: "Psychiatrist",
    icon: "🧘",
    description: "Mental health specialists"
  },
  {
    id: "Gynecologist",
    name: "Gynecologist",
    icon: "👩",
    description: "Women's health specialists"
  },
  {
    id: "Ophthalmologist",
    name: "Ophthalmologist",
    icon: "👁️",
    description: "Eye specialists"
  },
  {
    id: "General Physician",
    name: "General Physician",
    icon: "🩺",
    description: "Primary healthcare providers"
  }
];

// Map of Indian states to their real coordinates (longitude, latitude)
const stateCoordinates: Record<string, [number, number]> = {
  'Andhra Pradesh': [79.74, 15.91],
  'Arunachal Pradesh': [94.73, 28.21],
  'Assam': [92.93, 26.20],
  'Bihar': [85.31, 25.09],
  'Chhattisgarh': [81.86, 21.27],
  'Goa': [74.12, 15.29],
  'Gujarat': [71.19, 22.25],
  'Haryana': [76.08, 29.05],
  'Himachal Pradesh': [77.17, 31.10],
  'Jharkhand': [85.27, 23.61],
  'Karnataka': [75.71, 15.31],
  'Kerala': [76.27, 10.85],
  'Madhya Pradesh': [78.65, 22.97],
  'Maharashtra': [75.71, 19.75],
  'Manipur': [93.90, 24.66],
  'Meghalaya': [91.36, 25.46],
  'Mizoram': [92.93, 23.16],
  'Nagaland': [94.56, 26.15],
  'Odisha': [85.09, 20.95],
  'Punjab': [75.34, 31.14],
  'Rajasthan': [74.21, 27.02],
  'Sikkim': [88.51, 27.53],
  'Tamil Nadu': [78.65, 11.12],
  'Telangana': [79.01, 18.11],
  'Tripura': [91.98, 23.94],
  'Uttar Pradesh': [80.94, 26.84],
  'Uttarakhand': [79.01, 30.06],
  'West Bengal': [87.85, 22.98],
  'Andaman and Nicobar Islands': [92.79, 11.74],
  'Chandigarh': [76.77, 30.73],
  'Dadra and Nagar Haveli and Daman and Diu': [73.01, 20.18],
  'Delhi': [77.10, 28.70],
  'Jammu and Kashmir': [74.79, 34.08],
  'Ladakh': [77.57, 34.22],
  'Lakshadweep': [72.18, 10.56],
  'Puducherry': [79.80, 11.94]
};

// Map of districts to their approximate coordinates
const districtCoordinates: Record<string, [number, number]> = {
  // Major cities with accurate coordinates
  'Mumbai': [72.87, 19.07],
  'Delhi': [77.21, 28.61],
  'Bangalore': [77.59, 12.97],
  'Chennai': [80.27, 13.08],
  'Kolkata': [88.36, 22.57],
  'Hyderabad': [78.47, 17.38],
  'Ahmedabad': [72.58, 23.02],
  'Pune': [73.85, 18.52],
  'Jaipur': [75.78, 26.91],
  'Lucknow': [80.92, 26.84],
  'Kanpur': [80.35, 26.45],
  'Nagpur': [79.08, 21.14],
  'Visakhapatnam': [83.28, 17.68],
  'Indore': [75.85, 22.72],
  'Patna': [85.13, 25.59],
  'Chandigarh': [76.78, 30.73],
  'Bhopal': [77.40, 23.25],
  'Surat': [72.83, 21.17],
  'Kochi': [76.27, 9.93],
  'Guwahati': [91.75, 26.19]
};

export const getDoctors = (locationData: LocationType, specialty?: string): Doctor[] => {
  // Create a deterministic but realistic set of doctors based on the location
  const seed = `${locationData.area}-${locationData.district}-${locationData.state}-${locationData.country}`;
  let seedValue = 0;
  for (let i = 0; i < seed.length; i++) {
    seedValue += seed.charCodeAt(i);
  }
  
  // Real clinic names in India
  const clinics = [
    "Apollo Hospital",
    "Max Healthcare",
    "Fortis Hospital",
    "AIIMS",
    "Narayana Health",
    "Medanta Hospital",
    "Columbia Asia Hospital",
    "Manipal Hospital",
    "Tata Memorial Hospital",
    "Ruby Hall Clinic",
    "Kokilaben Hospital",
    "Hinduja Hospital",
    "Lilavati Hospital",
    "Christian Medical College",
    "Care Hospitals",
    "BLK Super Speciality Hospital",
    "Wockhardt Hospital",
    "Jaslok Hospital",
    "Artemis Hospital",
    "Sir Ganga Ram Hospital"
  ];
  
  // Real Indian doctor surnames
  const surnames = [
    "Sharma", "Patel", "Singh", "Verma", "Gupta", 
    "Kumar", "Iyer", "Rao", "Mehta", "Deshpande",
    "Choudhury", "Joshi", "Desai", "Reddy", "Shah",
    "Chatterjee", "Nair", "Prasad", "Menon", "Bose",
    "Chakraborty", "Patil", "Banerjee", "Kapoor", "Khanna"
  ];
  
  const generateDoctor = (id: number): Doctor => {
    const randomValue = (seedValue + id) * 9973; // Use a prime number for better distribution
    const specialtyIndex = randomValue % specialties.length;
    const clinicIndex = (randomValue / 10) % clinics.length;
    const surnameIndex = (randomValue / 100) % surnames.length;
    const available = (randomValue % 5) !== 0; // 80% availability
    const rating = 3.5 + (randomValue % 20) / 10; // Rating between 3.5 and 5.5
    const fee = 500 + (randomValue % 10) * 200; // Fee between 500 and 2300
    const experience = 2 + (randomValue % 20); // Experience between 2 and 21 years
    const waitTime = 5 + (randomValue % 60); // Wait time between 5 and 64 minutes
    
    // Generate a set of available days (at least 3 days a week)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shuffledDays = [...days].sort(() => 0.5 - Math.random());
    const numDays = 3 + (randomValue % 4); // Between 3 and 6 days
    const availableDays = shuffledDays.slice(0, numDays);
    
    // Generate realistic Indian doctor names
    const firstNames = ["Dr. Arjun", "Dr. Vikram", "Dr. Priya", "Dr. Neha", "Dr. Raj", 
                        "Dr. Sanjay", "Dr. Meera", "Dr. Amit", "Dr. Anjali", "Dr. Rahul",
                        "Dr. Sunita", "Dr. Kiran", "Dr. Deepak", "Dr. Anil", "Dr. Shikha"];
    const firstNameIndex = (randomValue / 1000) % firstNames.length;
    
    const name = `${firstNames[firstNameIndex]} ${surnames[surnameIndex]}`;
    
    return {
      id,
      name,
      specialty: specialties[specialtyIndex].name,
      clinic: clinics[clinicIndex],
      address: `${locationData.area}, ${locationData.district}, ${locationData.state}`,
      available,
      availableDays,
      rating,
      reviews: 10 + (randomValue % 200),
      fee,
      experience,
      image: `/placeholder.svg`,
      waitTime
    };
  };
  
  // Generate a list of doctors
  const doctorCount = 10 + (seedValue % 15); // Between 10 and 24 doctors
  let doctors: Doctor[] = [];
  
  for (let i = 1; i <= doctorCount; i++) {
    doctors.push(generateDoctor(i));
  }
  
  // Filter by specialty if provided
  if (specialty) {
    doctors = doctors.filter(doctor => doctor.specialty === specialty);
  }
  
  return doctors;
};

// Get real coordinates for a state
export const getStateCoordinates = (state: string): [number, number] => {
  if (state in stateCoordinates) {
    return stateCoordinates[state];
  }
  
  // Fallback to center of India if state not found
  return [78.96, 20.59];
};

// Get real coordinates for a district within a state
export const getDistrictCoordinates = (state: string, district: string): [number, number] => {
  // Check if we have exact coordinates for this district
  if (district in districtCoordinates) {
    return districtCoordinates[district];
  }
  
  // If not, get state coordinates and add a slight offset
  const stateCoords = getStateCoordinates(state);
  
  // Create a deterministic but realistic offset based on the district name
  let districtHash = 0;
  for (let i = 0; i < district.length; i++) {
    districtHash += district.charCodeAt(i);
  }
  
  // Create a small offset (±0.5 degrees) to place it within the state
  const longitudeOffset = ((districtHash % 100) / 100) - 0.5;
  const latitudeOffset = ((districtHash / 100) % 100) / 100 - 0.5;
  
  return [
    stateCoords[0] + longitudeOffset,
    stateCoords[1] + latitudeOffset
  ];
};

// Get coordinates for an area within a district
export const getAreaCoordinates = (state: string, district: string, area: string): [number, number] => {
  // Get district coordinates
  const districtCoords = getDistrictCoordinates(state, district);
  
  // Create a very small offset based on the area name (±0.1 degrees)
  let areaHash = 0;
  for (let i = 0; i < area.length; i++) {
    areaHash += area.charCodeAt(i);
  }
  
  const longitudeOffset = ((areaHash % 100) / 500) - 0.1;
  const latitudeOffset = ((areaHash / 100) % 100) / 500 - 0.1;
  
  return [
    districtCoords[0] + longitudeOffset,
    districtCoords[1] + latitudeOffset
  ];
};

// Function to find doctors by location and specialty
export const findDoctorsByLocationAndSpecialty = (
  locationData: LocationType,
  specialty: string
): Doctor[] => {
  return getDoctors(locationData).filter(
    (doctor) => doctor.specialty === specialty
  );
};

export const findNearbyDoctors = (
  locationData: LocationType,
  specialty: string
): Doctor[] => {
  // In a real app, this would use geolocation to find truly nearby doctors
  // For demo purposes, we'll just return doctors with the same specialty from a different area
  
  // Create a "nearby" location by slightly modifying the area
  const nearbyLocation: LocationType = {
    ...locationData,
    area: locationData.area === "Bandra" ? "Andheri" : "Juhu",
  };
  
  return getDoctors(nearbyLocation).filter(
    (doctor) => doctor.specialty === specialty
  ).slice(0, 3); // Limit to 3 nearby doctors
};
