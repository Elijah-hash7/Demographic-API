import { DataSource } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { v7 as uuidv7 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'insighta.db',
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
  let inserted = 0;
  let updated = 0;

  for (const p of profiles) {
    const existing = await repo.findOne({ where: { name: p.name } });

    if (existing) {
      await repo.update({ name: p.name }, {
        gender: p.gender,
        gender_probability: p.gender_probability,
        age: p.age,
        age_group: p.age_group,
        country_id: p.country_id,
        country_name: p.country_name,
        country_probability: p.country_probability,
      });
      updated++;
    } else {
      await repo.save({
        id: uuidv7(),
        name: p.name,
        gender: p.gender,
        gender_probability: p.gender_probability,
        age: p.age,
        age_group: p.age_group,
        country_id: p.country_id,
        country_name: p.country_name,
        country_probability: p.country_probability,
      });
      inserted++;
    }
  }

  console.log(`Seed complete: ${inserted} inserted, ${updated} updated`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
