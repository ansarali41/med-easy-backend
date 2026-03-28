import { Injectable } from '@nestjs/common';

@Injectable()
export class LabServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
