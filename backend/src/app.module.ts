import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ParticipantsModule } from './participants/participants.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [
    DatabaseModule,
    ParticipantsModule,
    CoursesModule,
    EnrollmentsModule,
    CertificatesModule,
  ],
})
export class AppModule {}
