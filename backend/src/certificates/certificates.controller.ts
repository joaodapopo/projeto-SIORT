import { Controller, Get, Query } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  /** GET /certificates?email=xxx — Get certificate data for a participant */
  @Get()
  findByEmail(@Query('email') email: string) {
    return this.certificatesService.findByEmail(email);
  }
}
