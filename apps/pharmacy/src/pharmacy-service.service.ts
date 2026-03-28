import { Injectable } from '@nestjs/common';

@Injectable()
export class PharmacyServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
