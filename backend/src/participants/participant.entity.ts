import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 14, unique: true })
  cpf: string;

  @Column({ length: 255, nullable: true })
  institution: string;

  @Column({ length: 255, default: 'participant' })
  role: string;

  @CreateDateColumn()
  registeredAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.participant)
  enrollments: Enrollment[];
}
