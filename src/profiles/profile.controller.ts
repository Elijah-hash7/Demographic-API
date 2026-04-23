import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ProfilesService } from './profile.service';
import { FilterProfilesDto } from './dto/filter-profile.dto';
import { parseNaturalQuery } from './utils/query-parser';

@Controller('api/profiles') // WHY: all routes in this controller start with /api/profiles
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async findAll(@Query() filters: FilterProfilesDto) {
    if (
      filters.min_age !== undefined &&
      filters.max_age !== undefined &&
      filters.min_age > filters.max_age
    ) {
      throw new HttpException(
        { status: 'error', message: 'Invalid query parameters' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.profilesService.findAll(filters);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (!query || !query.trim()) {
      throw new HttpException(
        { status: 'error', message: 'Invalid query parameters' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const parsed = parseNaturalQuery(query);

    if (!parsed) {
      throw new HttpException(
        { status: 'error', message: 'Unable to interpret query' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const filters: FilterProfilesDto = {
      ...parsed,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    return this.profilesService.findAll(filters);
  }
}
