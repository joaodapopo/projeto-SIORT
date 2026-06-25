import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Título é obrigatório.' })
  title: string;

  @IsNotEmpty({ message: 'Instrutor é obrigatório.' })
  instructor: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  description: string;

  @IsNotEmpty({ message: 'Duração é obrigatória.' })
  duration: string;

  @IsNotEmpty({ message: 'Horário é obrigatório.' })
  schedule: string;

  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array.' })
  tags?: string[];
}
