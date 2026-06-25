import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /** POST /enrollments — Toggle enrollment (enroll/unenroll) */
  @Post()
  toggle(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.toggle(dto);
  }

  /** GET /enrollments?email=xxx — List enrollments by participant email */
  @Get()
  findByEmail(@Query('email') email: string) {
    return this.enrollmentsService.findByEmail(email);
  }

  /** GET /enrollments/course/:courseId — List enrollments by course */
  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.findByCourse(courseId);
  }
}
