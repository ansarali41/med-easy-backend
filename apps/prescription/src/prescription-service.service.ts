import { Injectable } from '@nestjs/common';

@Injectable()
export class PrescriptionServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
