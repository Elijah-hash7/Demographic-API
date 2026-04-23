import { IsOptional, IsIn, IsInt, IsNumber, Min, Max, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProfilesDto {

  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: string;

  @IsOptional()
  @IsIn(['child', 'teenager', 'adult', 'senior'])
  age_group?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'country_id must be a 2-letter uppercase ISO code' })
  country_id?: string;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_age?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_age?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  min_gender_probability?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  min_country_probability?: number;

  // --- SORTING ---
  @IsOptional()
  @IsIn(['age', 'created_at', 'gender_probability'])
  sort_by?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  // --- PAGINATION ---
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
