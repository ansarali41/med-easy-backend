import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionServiceController } from './prescription-service.controller';
import { PrescriptionServiceService } from './prescription-service.service';

describe('PrescriptionServiceController', () => {
  let prescriptionServiceController: PrescriptionServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionServiceController],
      providers: [PrescriptionServiceService],
    }).compile();

    prescriptionServiceController = app.get<PrescriptionServiceController>(PrescriptionServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(prescriptionServiceController.getHello()).toBe('Hello World!');
    });
  });
});
