import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profile.module';
import { Profile } from './profiles/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'insighta.db',
      entities: [Profile],
      synchronize: true,
    }),
    ProfilesModule,
  ],
})
export class AppModule {}
