import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsInt({ message: 'ID do curso deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'ID do curso é obrigatório.' })
  courseId: number;
}
