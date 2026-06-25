import { IsNotEmpty, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateParticipantDto {
  @IsNotEmpty({ message: 'Nome completo é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  phone: string;

  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  cpf: string;

  @IsOptional()
  institution?: string;

  @IsOptional()
  role?: string;
}
