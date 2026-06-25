import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { LoginParticipantDto } from './dto/login-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  /** POST /participants — Register a new participant */
  @Post()
  create(@Body() dto: CreateParticipantDto) {
    return this.participantsService.create(dto);
  }

  /** POST /participants/login — Login by email */
  @Post('login')
  login(@Body() dto: LoginParticipantDto) {
    return this.participantsService.findByEmail(dto.email);
  }

  /** GET /participants — List all participants */
  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  /** GET /participants/count — Get total count */
  @Get('count')
  async count() {
    const total = await this.participantsService.count();
    return { count: total };
  }

  /** GET /participants/:id — Get participant by ID */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.participantsService.findOne(id);
  }
}
