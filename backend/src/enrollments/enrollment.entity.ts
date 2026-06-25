import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Participant } from '../participants/participant.entity';
import { Course } from '../courses/course.entity';

@Entity('enrollments')
@Unique(['participantId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  participantId: number;

  @Column()
  courseId: number;

  @CreateDateColumn()
  enrolledAt: Date;

  @ManyToOne(() => Participant, (participant) => participant.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
