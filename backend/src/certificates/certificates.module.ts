import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { ParticipantsModule } from '../participants/participants.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [ParticipantsModule, EnrollmentsModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
