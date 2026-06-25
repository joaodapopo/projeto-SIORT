import { IsOptional, IsArray } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  instructor?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  duration?: string;

  @IsOptional()
  schedule?: string;

  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array.' })
  tags?: string[];
}
