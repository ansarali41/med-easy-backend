import { Test, TestingModule } from '@nestjs/testing';
import { LabServiceController } from './lab-service.controller';
import { LabServiceService } from './lab-service.service';

describe('LabServiceController', () => {
  let labServiceController: LabServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LabServiceController],
      providers: [LabServiceService],
    }).compile();

    labServiceController = app.get<LabServiceController>(LabServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(labServiceController.getHello()).toBe('Hello World!');
    });
  });
});
