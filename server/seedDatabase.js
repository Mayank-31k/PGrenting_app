require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const PG = require('./models/PG');
const Inquiry = require('./models/Inquiry');

// Sample data transformation
const samplePGData = [
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
    food: "Veg & Non-veg meals included"
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
    food: "Quality 3 meals daily"
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
    food: "Self-cooking kitchenette available"
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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const facilityMapping = {
  'WiFi': 'wifi',
  'AC': 'ac',
  'Power Backup': 'power_backup',
  '24/7 Water Supply': 'water',
  'CCTV Security': 'cctv',
  'CCTV': 'cctv',
  'Meals': 'meal_service',
  'Quality Food (3 meals)': 'meal_service',
  '3 Meals': 'meal_service',
  'Food Included': 'meal_service',
  'RO Water': 'water',
  'Geyser': 'attached_bathroom',
  'Laundry Service': 'laundry',
  'Laundry': 'laundry',
  'Attached Washrooms': 'attached_bathroom',
  'Attached Washroom': 'attached_bathroom',
  'Parking': 'parking',
  'Fridge': 'kitchen',
  'Washing Machine': 'laundry',
  'Kitchenette': 'kitchen',
  'Branded furnishings': 'furniture',
  'High-speed WiFi': 'wifi',
  'Housekeeping': 'housekeeping',
  'Gym': 'fitness',
  'Cafe': 'dining_hall',
  'Community Lounge': 'common_room',
  'Fully furnished': 'furniture',
  'App-based meals': 'meal_service',
  'Fitness zone': 'fitness',
  'Doctor on-call': 'security_guard',
  'Biometric security': 'cctv',
  'TV': 'furniture',
  'Security': 'security_guard',
  'Bed': 'furniture',
  'Almirah': 'furniture',
  'Table': 'furniture',
  'Chair': 'furniture'
};

const transformFacilities = (facilities) => {
  const basic = {};
  const amenities = {};
  const services = {};
  
  // Initialize all to false
  const basicFacilities = ['wifi', 'electricity', 'water', 'furniture', 'ac', 'fan', 'attached_bathroom', 'common_bathroom'];
  const amenityFacilities = ['kitchen', 'dining_hall', 'common_room', 'study_room', 'garden', 'terrace', 'parking', 'cctv', 'security_guard', 'laundry', 'power_backup'];
  const serviceFacilities = ['housekeeping', 'meal_service', 'tiffin_service', 'transport'];
  
  basicFacilities.forEach(f => basic[f] = false);
  amenityFacilities.forEach(f => amenities[f] = false);
  serviceFacilities.forEach(f => services[f] = false);
  
  // Set default essentials
  basic.electricity = true;
  basic.water = true;
  basic.fan = true;
  basic.common_bathroom = true;
  
  facilities.forEach(facility => {
    const mapped = facilityMapping[facility];
    if (mapped) {
      if (basicFacilities.includes(mapped)) {
        basic[mapped] = true;
      } else if (amenityFacilities.includes(mapped)) {
        amenities[mapped] = true;
      } else if (serviceFacilities.includes(mapped)) {
        services[mapped] = true;
      }
    }
  });
  
  return { basic, amenities, services };
};

const createOwner = async (ownerName, phone) => {
  const cleanEmail = ownerName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '') + '@pgowner.com';
  
  let user = await User.findOne({ email: cleanEmail });
  
  if (!user) {
    const cleanPhone = phone.replace(/[^\d]/g, '').slice(-10);
    
    user = new User({
      name: ownerName,
      email: cleanEmail,
      phone: cleanPhone,
      password: 'owner123',
      role: 'owner'
    });
    await user.save();
  }
  
  return user;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await PG.deleteMany({});
    await Inquiry.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@pgrenter.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Created admin user');
    
    // Create PGs
    for (const pgData of samplePGData) {
      const owner = await createOwner(pgData.owner, pgData.phone);
      
      const facilities = transformFacilities(pgData.facilities);
      
      const pg = new PG({
        name: pgData.name,
        description: `Experience comfortable living at ${pgData.name}. ${pgData.food}. Perfect for students and working professionals.`,
        owner: owner._id,
        location: {
          address: pgData.location,
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110042',
          coordinates: {
            latitude: 28.7041 + (Math.random() - 0.5) * 0.01,
            longitude: 77.1025 + (Math.random() - 0.5) * 0.01
          },
          nearbyLandmarks: ['DTU Campus', 'Metro Station', 'Market']
        },
        contact: {
          phone: pgData.phone.replace(/[^\d]/g, '').slice(-10),
          email: owner.email,
          whatsapp: pgData.phone.replace(/[^\d]/g, '').slice(-10)
        },
        accommodation: {
          gender: pgData.gender.toLowerCase() === 'girls' ? 'female' : 'male',
          totalRooms: Math.floor(Math.random() * 20) + 10,
          availableRooms: Math.floor(Math.random() * 5) + 1,
          roomTypes: [{
            type: 'double',
            capacity: 2,
            rent: pgData.rent,
            available: Math.floor(Math.random() * 3) + 1,
            description: pgData.sharing
          }]
        },
        pricing: {
          rent: pgData.rent,
          securityDeposit: pgData.deposit,
          maintenanceCharges: Math.floor(Math.random() * 1000) + 500,
          electricityCharges: 'extra'
        },
        facilities,
        images: [{
          url: pgData.image,
          caption: `${pgData.name} - Main View`,
          isPrimary: true
        }],
        rules: {
          smoking: 'not_allowed',
          alcohol: 'not_allowed',
          visitors: 'restricted_hours',
          pets: 'not_allowed',
          curfew: '11:00 PM',
          additional: ['No loud music after 10 PM', 'Keep common areas clean']
        },
        ratings: {
          average: 3.5 + Math.random() * 1.5,
          count: Math.floor(Math.random() * 50) + 10
        },
        status: 'active',
        features: {
          isFeatured: Math.random() > 0.7,
          isPremium: pgData.rent > 15000
        },
        distance: pgData.distanceFromCollege
      });
      
      await pg.save();
      console.log(`✅ Created PG: ${pgData.name}`);
    }
    
    // Create some sample users
    const sampleUsers = [
      { name: 'Rahul Kumar', email: 'rahul@student.com', course: 'BTech CSE' },
      { name: 'Priya Singh', email: 'priya@student.com', course: 'BTech ECE' },
      { name: 'Vikash Singh', email: 'vikash@student.com', course: 'BTech ME' },
      { name: 'Sneha Sharma', email: 'sneha@student.com', course: 'BTech CSE' },
      { name: 'Amit Sharma', email: 'amit@student.com', course: 'BTech CSE' }
    ];
    
    for (const userData of sampleUsers) {
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: 'student123',
        phone: `9876${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
        profile: {
          occupation: userData.course
        }
      });
      await user.save();
      console.log(`✅ Created user: ${userData.name}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${await User.countDocuments()} users`);
    console.log(`   - ${await PG.countDocuments()} PGs`);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

runSeed();