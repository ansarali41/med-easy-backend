import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
