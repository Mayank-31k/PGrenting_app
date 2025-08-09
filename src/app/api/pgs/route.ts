import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/lib/models/User';
import PG from '@/lib/models/PG';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const gender = searchParams.get('gender');
    const minRent = searchParams.get('minRent');
    const maxRent = searchParams.get('maxRent');
    const facilities = searchParams.get('facilities');
    
    console.log('PG API Filter params:', { search, city, gender, minRent, maxRent, facilities });
    
    await connectDB();
    
    // Ensure models are registered
    User;
    PG;
    
    let filter: any = { status: 'active' };
    let searchConditions: any[] = [];
    let facilityConditions: any[] = [];
    
    // Handle search across name, location, and description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      searchConditions = [
        { name: searchRegex },
        { 'location.address': searchRegex },
        { 'location.city': searchRegex },
        { 'location.area': searchRegex },
        { description: searchRegex }
      ];
    }
    
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (gender && gender !== 'any') {
      // Map frontend gender values to database values
      let dbGender = gender;
      if (gender === 'boys') dbGender = 'male';
      if (gender === 'girls') dbGender = 'female';
      
      filter['accommodation.gender'] = { $in: [dbGender, 'mixed'] };
    }
    
    if (minRent || maxRent) {
      filter['pricing.rent'] = {};
      if (minRent) filter['pricing.rent'].$gte = parseInt(minRent);
      if (maxRent) filter['pricing.rent'].$lte = parseInt(maxRent);
    }
    
    if (facilities) {
      const facilityList = facilities.split(',');
      
      facilityList.forEach(facility => {
        const trimmedFacility = facility.trim();
        
        // Create mapping for common facility names
        const facilityMap: { [key: string]: string } = {
          'WiFi': 'wifi',
          'AC': 'ac',
          'Power Backup': 'power_backup',
          'Meals': 'meals',
          'Laundry': 'laundry',
          'Gym': 'gym',
          'Parking': 'parking',
          'CCTV': 'cctv',
          'RO Water': 'ro_water',
          'Geyser': 'geyser',
          'Fridge': 'fridge',
          'Kitchen': 'kitchen',
          'TV': 'tv',
          'Cleaning Service': 'cleaning_service'
        };
        
        const dbFacilityName = facilityMap[trimmedFacility] || trimmedFacility.toLowerCase().replace(/\s+/g, '_');
        
        // Search in all facility categories for this specific facility
        facilityConditions.push({
          $or: [
            { [`facilities.basic.${dbFacilityName}`]: true },
            { [`facilities.amenities.${dbFacilityName}`]: true },
            { [`facilities.services.${dbFacilityName}`]: true }
          ]
        });
      });
    }
    
    // Combine search and facility conditions
    const orConditions: any[] = [];
    if (searchConditions.length > 0) {
      orConditions.push({ $or: searchConditions });
    }
    if (facilityConditions.length > 0) {
      // All selected facilities must be present (AND logic)
      filter.$and = facilityConditions;
    }
    if (orConditions.length > 0) {
      if (filter.$and) {
        filter.$and.push(...orConditions);
      } else {
        filter.$and = orConditions;
      }
    }
    
    console.log('Final PG filter:', JSON.stringify(filter, null, 2));
    
    const pgs = await PG.find(filter)
      .populate('owner', 'name email phone')
      .sort({ 'features.isFeatured': -1, 'ratings.average': -1, createdAt: -1 })
      .limit(50);
    
    console.log(`Found ${pgs.length} PGs matching filter`);
    
    return NextResponse.json(pgs);
  } catch (error) {
    console.error('Get PGs error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}