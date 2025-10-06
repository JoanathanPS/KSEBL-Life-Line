/**
 * Database Seeding Script for Kerala Line Break Detection System
 * Seeds the database with Kerala substations, feeders, and sample users
 */

import { db } from '../server/db.js';
import { 
  users, 
  substations, 
  feeders, 
  lineBreakEvents, 
  waveformData,
  modelMetrics 
} from '../shared/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

interface KeralaDistrict {
  name: string;
  code: string;
  lat: number;
  lng: number;
  voltageLevel: string;
  capacityMva: number;
}

const KERALA_DISTRICTS: KeralaDistrict[] = [
  { name: 'Thiruvananthapuram', code: 'TVM', lat: 8.5241, lng: 76.9366, voltageLevel: '11kV', capacityMva: 50 },
  { name: 'Kollam', code: 'KLM', lat: 8.8932, lng: 76.6141, voltageLevel: '11kV', capacityMva: 45 },
  { name: 'Pathanamthitta', code: 'PTA', lat: 9.2647, lng: 76.7870, voltageLevel: '11kV', capacityMva: 35 },
  { name: 'Alappuzha', code: 'ALP', lat: 9.4981, lng: 76.3388, voltageLevel: '11kV', capacityMva: 40 },
  { name: 'Kottayam', code: 'KTM', lat: 9.5916, lng: 76.5222, voltageLevel: '11kV', capacityMva: 42 },
  { name: 'Idukki', code: 'IDK', lat: 9.8497, lng: 76.9681, voltageLevel: '11kV', capacityMva: 30 },
  { name: 'Ernakulam', code: 'EKM', lat: 9.9816, lng: 76.2999, voltageLevel: '11kV', capacityMva: 60 },
  { name: 'Thrissur', code: 'TSR', lat: 10.5276, lng: 76.2144, voltageLevel: '11kV', capacityMva: 55 },
  { name: 'Palakkad', code: 'PLK', lat: 10.7867, lng: 76.6548, voltageLevel: '11kV', capacityMva: 48 },
  { name: 'Malappuram', code: 'MLP', lat: 11.0404, lng: 76.0819, voltageLevel: '11kV', capacityMva: 38 },
  { name: 'Kozhikode', code: 'KZD', lat: 11.2588, lng: 75.7804, voltageLevel: '11kV', capacityMva: 52 },
  { name: 'Wayanad', code: 'WYD', lat: 11.6050, lng: 76.0830, voltageLevel: '11kV', capacityMva: 25 },
  { name: 'Kannur', code: 'KNR', lat: 11.8745, lng: 75.3704, voltageLevel: '11kV', capacityMva: 40 },
  { name: 'Kasaragod', code: 'KSD', lat: 12.4984, lng: 74.9899, voltageLevel: '11kV', capacityMva: 28 },
];

const CONDUCTOR_TYPES = [
  'AAC', 'ACSR', 'AAAC', 'ACAR', 'ACSS'
];

const AREA_TYPES = ['urban', 'rural', 'semi-urban'] as const;

class DatabaseSeeder {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Seed users table
   */
  async seedUsers(): Promise<void> {
    console.log('🌱 Seeding users...');

    const userData = [
      {
        email: 'admin@ksebl.gov.in',
        passwordHash: await this.hashPassword('Admin@123'),
        fullName: 'System Administrator',
        role: 'admin',
        phone: '+919876543210',
        isActive: true,
      },
      {
        email: 'operator@ksebl.gov.in',
        passwordHash: await this.hashPassword('Operator@123'),
        fullName: 'Control Room Operator',
        role: 'operator',
        phone: '+919876543211',
        isActive: true,
      },
      {
        email: 'field.crew1@ksebl.gov.in',
        passwordHash: await this.hashPassword('FieldCrew@123'),
        fullName: 'Field Crew Leader - TVM',
        role: 'field_crew',
        phone: '+919876543212',
        isActive: true,
      },
      {
        email: 'field.crew2@ksebl.gov.in',
        passwordHash: await this.hashPassword('FieldCrew@123'),
        fullName: 'Field Crew Leader - EKM',
        role: 'field_crew',
        phone: '+919876543213',
        isActive: true,
      },
      {
        email: 'field.crew3@ksebl.gov.in',
        passwordHash: await this.hashPassword('FieldCrew@123'),
        fullName: 'Field Crew Leader - KZD',
        role: 'field_crew',
        phone: '+919876543214',
        isActive: true,
      },
    ];

    await db.insert(users).values(userData);
    console.log(`✅ Created ${userData.length} users`);
  }

  /**
   * Seed substations table
   */
  async seedSubstations(): Promise<void> {
    console.log('🌱 Seeding substations...');

    const substationData = KERALA_DISTRICTS.map((district, index) => ({
      name: `${district.name} Main Substation`,
      code: `${district.code}-SS-001`,
      locationLat: district.lat.toString(),
      locationLng: district.lng.toString(),
      address: `Main Substation, ${district.name}, Kerala, India`,
      voltageLevel: district.voltageLevel,
      capacityMva: district.capacityMva.toString(),
      isActive: true,
    }));

    await db.insert(substations).values(substationData);
    console.log(`✅ Created ${substationData.length} substations`);
  }

  /**
   * Seed feeders table
   */
  async seedFeeders(): Promise<void> {
    console.log('🌱 Seeding feeders...');

    // Get all substations
    const substationList = await db.select().from(substations);
    const feederData = [];

    for (const substation of substationList) {
      // Create 15-25 feeders per substation
      const numFeeders = Math.floor(Math.random() * 11) + 15; // 15-25 feeders

      for (let i = 1; i <= numFeeders; i++) {
        const feederCode = `${substation.code}-F${i.toString().padStart(2, '0')}`;
        const lengthKm = Math.random() * 13 + 2; // 2-15 km
        const typicalLoadKw = Math.random() * 450 + 50; // 50-500 kW
        const numConsumers = Math.floor(Math.random() * 180) + 20; // 20-200 consumers

        feederData.push({
          substationId: substation.id,
          name: `Feeder ${i} - ${substation.name}`,
          code: feederCode,
          lengthKm: lengthKm.toString(),
          conductorType: CONDUCTOR_TYPES[Math.floor(Math.random() * CONDUCTOR_TYPES.length)],
          lineImpedanceReal: (Math.random() * 0.5 + 0.1).toString(), // 0.1-0.6 ohm/km
          lineImpedanceImag: (Math.random() * 0.3 + 0.05).toString(), // 0.05-0.35 ohm/km
          typicalLoadKw: typicalLoadKw.toString(),
          numConsumers,
          areaType: AREA_TYPES[Math.floor(Math.random() * AREA_TYPES.length)],
          isActive: true,
        });
      }
    }

    await db.insert(feeders).values(feederData);
    console.log(`✅ Created ${feederData.length} feeders`);
  }

  /**
   * Seed sample line break events
   */
  async seedLineBreakEvents(): Promise<void> {
    console.log('🌱 Seeding line break events...');

    // Get all feeders
    const feederList = await db.select().from(feeders);
    const userList = await db.select().from(users);

    const eventData = [];

    // Create 50 sample events over the last 30 days
    for (let i = 0; i < 50; i++) {
      const feeder = feederList[Math.floor(Math.random() * feederList.length)];
      const user = userList[Math.floor(Math.random() * userList.length)];
      const detectedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      const severity = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical';
      const status = ['detected', 'acknowledged', 'crew_dispatched', 'resolved'][Math.floor(Math.random() * 4)] as 'detected' | 'acknowledged' | 'crew_dispatched' | 'resolved';
      
      const confidenceScore = Math.random() * 0.3 + 0.7; // 0.7-1.0
      const estimatedLocationKm = Math.random() * 4.5 + 0.5; // 0.5-5.0 km
      const tripTimeMs = Math.floor(Math.random() * 200) + 100; // 100-300 ms

      eventData.push({
        feederId: feeder.id,
        detectedAt: detectedAt.toISOString(),
        detectionMethod: 'ai_model',
        confidenceScore: confidenceScore.toString(),
        estimatedLocationKm: estimatedLocationKm.toString(),
        faultType: 'LINE_BREAK',
        severity,
        status,
        breakerTripped: true,
        tripTimeMs,
        resolvedAt: status === 'resolved' ? new Date(detectedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : null,
        resolutionNotes: status === 'resolved' ? 'Line break repaired and power restored' : null,
        assignedTo: status !== 'detected' ? user.id : null,
      });
    }

    await db.insert(lineBreakEvents).values(eventData);
    console.log(`✅ Created ${eventData.length} line break events`);
  }

  /**
   * Seed sample waveform data
   */
  async seedWaveformData(): Promise<void> {
    console.log('🌱 Seeding waveform data...');

    // Get all feeders
    const feederList = await db.select().from(feeders);
    const waveformDataList = [];

    // Create 100 sample waveforms
    for (let i = 0; i < 100; i++) {
      const feeder = feederList[Math.floor(Math.random() * feederList.length)];
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
      
      // Generate sample waveform data (simplified)
      const sampleCount = 400; // 4 seconds at 100 Hz
      const currentR = Array.from({ length: sampleCount }, () => Math.random() * 100 - 50);
      const currentY = Array.from({ length: sampleCount }, () => Math.random() * 100 - 50);
      const currentB = Array.from({ length: sampleCount }, () => Math.random() * 100 - 50);
      const voltageR = Array.from({ length: sampleCount }, () => Math.random() * 50 + 200);
      const voltageY = Array.from({ length: sampleCount }, () => Math.random() * 50 + 200);
      const voltageB = Array.from({ length: sampleCount }, () => Math.random() * 50 + 200);

      waveformDataList.push({
        feederId: feeder.id,
        timestamp: timestamp.toISOString(),
        currentR: currentR.map(x => x.toString()),
        currentY: currentY.map(x => x.toString()),
        currentB: currentB.map(x => x.toString()),
        voltageR: voltageR.map(x => x.toString()),
        voltageY: voltageY.map(x => x.toString()),
        voltageB: voltageB.map(x => x.toString()),
        samplingRate: 10000,
        durationSeconds: '4.00',
        label: ['NORMAL', 'LINE_BREAK', 'SHORT_CIRCUIT', 'OVERLOAD'][Math.floor(Math.random() * 4)],
      });
    }

    await db.insert(waveformData).values(waveformDataList);
    console.log(`✅ Created ${waveformDataList.length} waveform data samples`);
  }

  /**
   * Seed model metrics
   */
  async seedModelMetrics(): Promise<void> {
    console.log('🌱 Seeding model metrics...');

    const metricsData = [
      {
        modelVersion: 'v1.0.0',
        accuracy: '0.9687',
        precision: '0.9523',
        recall: '0.9456',
        f1Score: '0.9489',
        falsePositiveRate: '0.018',
        evaluationDate: new Date().toISOString(),
        datasetSize: 10000,
        notes: 'Initial model trained on synthetic Kerala grid data',
      },
      {
        modelVersion: 'v1.1.0',
        accuracy: '0.9723',
        precision: '0.9587',
        recall: '0.9512',
        f1Score: '0.9549',
        falsePositiveRate: '0.015',
        evaluationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        datasetSize: 12000,
        notes: 'Updated model with additional real-world data',
      },
    ];

    await db.insert(modelMetrics).values(metricsData);
    console.log(`✅ Created ${metricsData.length} model metrics records`);
  }

  /**
   * Clear all data from tables
   */
  async clearDatabase(): Promise<void> {
    console.log('🧹 Clearing database...');

    // Delete in reverse order of dependencies
    await db.delete(modelMetrics);
    await db.delete(waveformData);
    await db.delete(lineBreakEvents);
    await db.delete(feeders);
    await db.delete(substations);
    await db.delete(users);

    console.log('✅ Database cleared');
  }

  /**
   * Run all seeding operations
   */
  async seed(): Promise<void> {
    try {
      console.log('🚀 Starting database seeding...');
      console.log('=' * 50);

      await this.clearDatabase();
      await this.seedUsers();
      await this.seedSubstations();
      await this.seedFeeders();
      await this.seedLineBreakEvents();
      await this.seedWaveformData();
      await this.seedModelMetrics();

      console.log('=' * 50);
      console.log('🎉 Database seeding completed successfully!');
      
      // Print summary
      const userCount = await db.select().from(users);
      const substationCount = await db.select().from(substations);
      const feederCount = await db.select().from(feeders);
      const eventCount = await db.select().from(lineBreakEvents);
      const waveformCount = await db.select().from(waveformData);

      console.log('\n📊 Database Summary:');
      console.log(`  Users: ${userCount.length}`);
      console.log(`  Substations: ${substationCount.length}`);
      console.log(`  Feeders: ${feederCount.length}`);
      console.log(`  Events: ${eventCount.length}`);
      console.log(`  Waveforms: ${waveformCount.length}`);

    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const seeder = new DatabaseSeeder();
  seeder.seed()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { DatabaseSeeder };
