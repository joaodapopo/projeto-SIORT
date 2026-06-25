import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginParticipantDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;
}
