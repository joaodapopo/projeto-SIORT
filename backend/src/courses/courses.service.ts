import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.entity';

@Injectable()
export class CoursesService implements OnModuleInit {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly coursesRepo: CoursesRepository) {}

  // ─── Seed initial data on first run ────────────────────────────────
  async onModuleInit(): Promise<void> {
    const count = await this.coursesRepo.count();
    if (count === 0) {
      this.logger.log('Seeding initial courses...');
      await this.coursesRepo.create({
        title: 'Minicurso 1: Introdução aos Implantes',
        instructor: 'Dr. Roberto Costa (USP)',
        description:
          'Introdução aos fundamentos da bioengenharia ortopédica, abordando anatomia articular, cinemática das articulações e critérios clínicos para indicação de implantes.',
        duration: '4 horas',
        schedule: '15/08 às 14:00',
        tags: JSON.stringify(['Bioengenharia', 'Clínica']),
      });
      await this.coursesRepo.create({
        title: 'Minicurso 2: Materiais Biocompatíveis',
        instructor: 'Dra. Eliana Silva (UNICAMP)',
        description:
          'Estudo aprofundado dos materiais usados em implantes (ligas de titânio, cerâmicas avançadas e polímeros ultra-resistentes) e sua interação celular e óssea (osseointegração).',
        duration: '4 horas',
        schedule: '16/08 às 14:00',
        tags: JSON.stringify(['Metalurgia', 'Biocompatibilidade']),
      });
      this.logger.log('✅ 2 courses seeded successfully.');
    }
  }

  // ─── CRUD ──────────────────────────────────────────────────────────
  async create(dto: CreateCourseDto): Promise<Course> {
    return this.coursesRepo.create({
      ...dto,
      tags: dto.tags ? JSON.stringify(dto.tags) : '[]',
    });
  }

  async findAll(): Promise<(Course & { parsedTags: string[] })[]> {
    const courses = await this.coursesRepo.findAll();
    return courses.map((c) => ({
      ...c,
      parsedTags: JSON.parse(c.tags || '[]') as string[],
    }));
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepo.findOne(id);
    if (!course) {
      throw new NotFoundException('Minicurso não encontrado.');
    }
    return course;
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    // Verify existence
    await this.findOne(id);

    const updateData: Partial<Course> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.instructor !== undefined) updateData.instructor = dto.instructor;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.schedule !== undefined) updateData.schedule = dto.schedule;
    if (dto.tags !== undefined) updateData.tags = JSON.stringify(dto.tags);

    const updated = await this.coursesRepo.update(id, updateData);
    if (!updated) {
      throw new NotFoundException('Minicurso não encontrado.');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.coursesRepo.remove(id);
    if (!deleted) {
      throw new NotFoundException('Minicurso não encontrado.');
    }
  }
}
