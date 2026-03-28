import { Test, TestingModule } from '@nestjs/testing';
import { PatientServiceController } from './patient-service.controller';
import { PatientServiceService } from './patient-service.service';

describe('PatientServiceController', () => {
  let patientServiceController: PatientServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PatientServiceController],
      providers: [PatientServiceService],
    }).compile();

    patientServiceController = app.get<PatientServiceController>(PatientServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(patientServiceController.getHello()).toBe('Hello World!');
    });
  });
});
