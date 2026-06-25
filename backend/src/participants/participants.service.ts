import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ParticipantsRepository } from './participants.repository';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(private readonly participantsRepo: ParticipantsRepository) {}

  async create(dto: CreateParticipantDto): Promise<Participant> {
    // Sanitize and format CPF
    const cleanCpf = dto.cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      throw new ConflictException('CPF inválido. O CPF deve conter exatamente 11 dígitos.');
    }
    const formattedCpf = cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    // Sanitize and format Phone
    const cleanPhone = dto.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      throw new ConflictException('Telefone inválido. O telefone deve conter 10 ou 11 dígitos.');
    }
    const formattedPhone = cleanPhone.length === 11
      ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      : cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');

    // Check for duplicate email
    const existing = await this.participantsRepo.findByEmail(
      dto.email.toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(
        'Já existe um participante cadastrado com este e-mail.',
      );
    }

    // Check for duplicate CPF
    const existingCpf = await this.participantsRepo.findByCpf(formattedCpf);
    if (existingCpf) {
      throw new ConflictException(
        'Já existe um participante cadastrado com este CPF.',
      );
    }

    return this.participantsRepo.create({
      ...dto,
      email: dto.email.toLowerCase(),
      cpf: formattedCpf,
      phone: formattedPhone,
    });
  }

  async findByEmail(email: string): Promise<Participant> {
    const participant = await this.participantsRepo.findByEmail(
      email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException(
        'E-mail não cadastrado no evento. Por favor, verifique a grafia ou inscreva-se.',
      );
    }
    return participant;
  }

  async findAll(): Promise<Participant[]> {
    return this.participantsRepo.findAll();
  }

  async findOne(id: number): Promise<Participant> {
    const participant = await this.participantsRepo.findOne(id);
    if (!participant) {
      throw new NotFoundException('Participante não encontrado.');
    }
    return participant;
  }

  async count(): Promise<number> {
    return this.participantsRepo.count();
  }
}
