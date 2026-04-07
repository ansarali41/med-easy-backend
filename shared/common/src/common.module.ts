import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ExceptionService } from './services/exception.service';

@Module({
  providers: [CommonService, ExceptionService],
  exports: [CommonService, ExceptionService],
})
export class CommonModule {}
