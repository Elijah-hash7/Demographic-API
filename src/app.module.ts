import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profile.module';
import { Profile } from './profiles/entities/profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/insighta',
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
      entities: [Profile],
      synchronize: true, // Auto-create tables (turn off in production if using migrations)
    }),
    ProfilesModule,
  ],
})
export class AppModule {}
