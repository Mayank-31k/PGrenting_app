export interface Testimonial {
  name: string;
  course: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PGData {
  id: number;
  name: string;
  location: string;
  rent: number;
  gender: string;
  distanceFromCollege: string;
  image: string;
  facilities: string[];
  owner: string;
  phone: string;
  sharing: string;
  deposit: number;
  food: string;
  testimonials?: Testimonial[];
}

export const samplePGData: PGData[] = [
  {
    id: 1,
    name: "Balaji PG",
    location: "Shahbad Daulatpur, Near DTU",
    rent: 10000,
    gender: "Boys",
    distanceFromCollege: "500-700m from DTU",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    facilities: ["WiFi", "AC", "Power Backup", "24/7 Water Supply", "CCTV Security", "Meals"],
    owner: "Mr. Balaji",
    phone: "+91 98765 43210",
    sharing: "Double/Triple sharing",
    deposit: 15000,
    food: "Veg & Non-veg meals included",
    testimonials: [
      {
        name: "Rahul Kumar",
        course: "BTech CSE",
        rating: 4,
        comment: "Very close to DTU campus, great for daily commute. Good facilities and food quality.",
        date: "2 months ago"
      },
      {
        name: "Vikash Singh",
        course: "BTech ME",
        rating: 5,
        comment: "Best location for DTU students. Walking distance to college and all facilities are excellent.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 2,
    name: "Asha PG for Boys",
    location: "Khasra No. 6/21, Shahbad Daulatpur",
    rent: 7500,
    gender: "Boys",
    distanceFromCollege: "1 km from DTU",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    facilities: ["AC", "WiFi", "Quality Food (3 meals)", "RO Water", "Geyser", "Power Backup", "Laundry Service"],
    owner: "Mr. Asha",
    phone: "+91 98765 43211",
    sharing: "Double/Triple sharing",
    deposit: 12000,
    food: "Quality 3 meals daily",
    testimonials: [
      {
        name: "Vikash Singh",
        course: "BTech ECE",
        rating: 5,
        comment: "Excellent food quality! Owner is very cooperative and helpful. Highly recommended for DTU students.",
        date: "3 weeks ago"
      },
      {
        name: "Amit Sharma",
        course: "BTech CSE",
        rating: 4,
        comment: "Great food and good management. Popular choice among DTU students for good reason.",
        date: "1 month ago"
      },
      {
        name: "Rohit Kumar",
        course: "BTech ME",
        rating: 5,
        comment: "Best PG for food quality near DTU. Owner is very understanding and cooperative.",
        date: "2 months ago"
      }
    ]
  },
  {
    id: 3,
    name: "Shree Shyama Chatrawas",
    location: "Near Shiv Mandir, Shahbad Daulatpur",
    rent: 9000,
    gender: "Boys",
    distanceFromCollege: "1.2 km from DTU",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    facilities: ["AC/Non-AC rooms", "WiFi", "Attached Washrooms", "3 Meals", "RO Water", "CCTV", "Parking"],
    owner: "Shree Shyama Trust",
    phone: "+91 98765 43212",
    sharing: "Double/Triple sharing",
    deposit: 15000,
    food: "3 meals daily"
  },
  {
    id: 4,
    name: "Lakshmi Girls PG",
    location: "Rohini Sector 17, Delhi",
    rent: 12000,
    gender: "Girls",
    distanceFromCollege: "2 km from DTU",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    facilities: ["AC", "WiFi", "Fridge", "Washing Machine", "Geyser", "Attached Washroom", "Kitchenette"],
    owner: "Mrs. Lakshmi",
    phone: "+91 98765 43213",
    sharing: "Double sharing",
    deposit: 18000,
    food: "Self-cooking kitchenette available",
    testimonials: [
      {
        name: "Priya Singh",
        course: "BTech CSE",
        rating: 5,
        comment: "Very safe and clean environment for girls. Excellent facilities and security. Highly recommended!",
        date: "2 weeks ago"
      },
      {
        name: "Sneha Sharma",
        course: "BTech ECE",
        rating: 4,
        comment: "Good facilities and safe location. Kitchenette is very useful for self-cooking. Owner is caring.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 5,
    name: "Your-Space Rohini (YS Boys)",
    location: "Rohini Sector 16, Delhi",
    rent: 20000,
    gender: "Boys",
    distanceFromCollege: "2.5 km from DTU",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=300&fit=crop",
    facilities: ["Branded furnishings", "High-speed WiFi", "Power Backup", "Housekeeping", "Gym", "Cafe", "Laundry", "Community Lounge"],
    owner: "Your-Space Management",
    phone: "+91 98765 43214",
    sharing: "Single/Double sharing",
    deposit: 25000,
    food: "Premium cafe meals"
  },
  {
    id: 6,
    name: "Stanza Living - DTU",
    location: "Rohini Sector 16, Delhi",
    rent: 17000,
    gender: "Boys",
    distanceFromCollege: "2-4 km from DTU",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    facilities: ["Fully furnished", "App-based meals", "WiFi", "Laundry", "Housekeeping", "Fitness zone", "Doctor on-call", "Biometric security"],
    owner: "Stanza Living",
    phone: "+91 98765 43215",
    sharing: "Single/Double/Triple",
    deposit: 20000,
    food: "App-based meal plans"
  },
  {
    id: 7,
    name: "Dr. Bhatti Niwas PG",
    location: "Rohini Sector 17, Near DTU",
    rent: 9500,
    gender: "Boys",
    distanceFromCollege: "1.5-2 km from DTU",
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5317ba?w=400&h=300&fit=crop",
    facilities: ["AC", "TV", "WiFi", "Food Included", "Geyser", "Power Backup"],
    owner: "Dr. Bhatti",
    phone: "+91 98765 43216",
    sharing: "Double/Triple sharing",
    deposit: 16000,
    food: "Homely meals included"
  },
  {
    id: 8,
    name: "Gaurav Girls PG",
    location: "Rohini Sector 17, Delhi",
    rent: 10000,
    gender: "Girls",
    distanceFromCollege: "2 km from DTU",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    facilities: ["AC rooms", "Homely food", "WiFi", "Security", "Attached Washrooms"],
    owner: "Mrs. Gaurav",
    phone: "+91 98765 43217",
    sharing: "Double/Triple sharing",
    deposit: 15000,
    food: "Homely food with variety"
  },
  {
    id: 9,
    name: "Sai Sharnam Boys PG",
    location: "Main Bawana Road, Shahbad Daulatpur",
    rent: 9500,
    gender: "Boys",
    distanceFromCollege: "900m from DTU",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    facilities: ["Bed", "Almirah", "Table", "Chair", "AC", "Geyser", "WiFi", "3 Meals", "Laundry", "RO water"],
    owner: "Sai Sharnam Trust",
    phone: "+91 98765 43218",
    sharing: "Double sharing",
    deposit: 15000,
    food: "3 meals with RO water"
  },
  {
    id: 10,
    name: "Krishna Kunj PG",
    location: "Shahbad Daulatpur, Delhi",
    rent: 8500,
    gender: "Boys",
    distanceFromCollege: "1.3 km from DTU",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    facilities: ["AC", "Power Backup", "WiFi", "Food (3 meals)", "CCTV"],
    owner: "Krishna Kunj Management",
    phone: "+91 98765 43219",
    sharing: "Double sharing",
    deposit: 12000,
    food: "3 meals daily with CCTV security"
  }
];