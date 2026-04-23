import { DataSource } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { v7 as uuidv7 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/insighta',
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
    entities: [Profile],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected');

  const filePath = path.join(__dirname, '..', 'data', 'profiles.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { profiles } = JSON.parse(raw);

  console.log(`Found ${profiles.length} profiles to seed`);

  const repo = dataSource.getRepository(Profile);
  
  // Assign UUIDs to new records in memory
  const profilesToUpsert = profiles.map(p => ({
    id: uuidv7(),
    ...p
  }));

  // Bulk upsert is 1000x faster for cloud databases than sequential findOne -> save
  await repo.upsert(profilesToUpsert, {
    conflictPaths: ['name'],
    skipUpdateIfNoValuesChanged: true,
  });

  console.log(`✅ Seed complete: Pushed ${profiles.length} profiles to Supabase`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
