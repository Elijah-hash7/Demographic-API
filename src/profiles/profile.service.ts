import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { FilterProfilesDto } from './dto/filter-profile.dto';

@Injectable() 
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async findAll(filters: FilterProfilesDto) {
    const qb = this.profileRepo.createQueryBuilder('p');

    if (filters.gender) {
      qb.andWhere('p.gender = :gender', { gender: filters.gender });
    }
    if (filters.age_group) {
      qb.andWhere('p.age_group = :age_group', { age_group: filters.age_group });
    }
    if (filters.country_id) {
      qb.andWhere('p.country_id = :country_id', { country_id: filters.country_id });
    }
    if (filters.min_age !== undefined) {
      qb.andWhere('p.age >= :min_age', { min_age: filters.min_age });
    }
    if (filters.max_age !== undefined) {
      qb.andWhere('p.age <= :max_age', { max_age: filters.max_age });
    }
    if (filters.min_gender_probability !== undefined) {
      qb.andWhere('p.gender_probability >= :mgp', { mgp: filters.min_gender_probability });
    }
    if (filters.min_country_probability !== undefined) {
      qb.andWhere('p.country_probability >= :mcp', { mcp: filters.min_country_probability });
    }

    const sortBy = filters.sort_by || 'created_at';
    const order = filters.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(`p.${sortBy}`, order);

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return {
      status: 'success',
      page,
      limit,
      total,
      data,
    };
  }
}
