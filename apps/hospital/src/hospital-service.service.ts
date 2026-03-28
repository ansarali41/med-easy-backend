import { Injectable } from '@nestjs/common';

@Injectable()
export class HospitalServiceService {
  getHello(): string {
    return 'Hospital Service is running!';
  }
}
