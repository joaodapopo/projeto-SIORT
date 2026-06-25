import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { ParticipantsRepository } from '../participants/participants.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly participantsRepo: ParticipantsRepository,
    private readonly coursesRepo: CoursesRepository,
  ) {}

  /**
   * Toggle enrollment: if already enrolled, unenroll; otherwise, enroll.
   * Mirrors the frontend toggle behavior.
   */
  async toggle(
    dto: CreateEnrollmentDto,
  ): Promise<{ enrolled: boolean; enrollment?: Enrollment }> {
    const participant = await this.participantsRepo.findByEmail(
      dto.email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException(
        'Participante não encontrado. Inscreva-se no evento primeiro.',
      );
    }

    const course = await this.coursesRepo.findOne(dto.courseId);
    if (!course) {
      throw new NotFoundException('Minicurso não encontrado.');
    }

    // Check if already enrolled
    const existing = await this.enrollmentRepo.findOne({
      where: {
        participantId: participant.id,
        courseId: dto.courseId,
      },
    });

    if (existing) {
      // Unenroll
      await this.enrollmentRepo.remove(existing);
      return { enrolled: false };
    }

    // Enroll
    const enrollment = this.enrollmentRepo.create({
      participantId: participant.id,
      courseId: dto.courseId,
    });
    const saved = await this.enrollmentRepo.save(enrollment);
    return { enrolled: true, enrollment: saved };
  }

  /**
   * Get all enrollments for a participant by email.
   */
  async findByEmail(
    email: string,
  ): Promise<{ participantId: number; courseId: number; enrolledAt: Date }[]> {
    const participant = await this.participantsRepo.findByEmail(
      email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException('Participante não encontrado.');
    }

    return this.enrollmentRepo.find({
      where: { participantId: participant.id },
      relations: { course: true },
    });
  }

  /**
   * Get all participants enrolled in a specific course.
   */
  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { courseId },
      relations: { participant: true },
    });
  }
}
