import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyServiceController } from './pharmacy-service.controller';
import { PharmacyServiceService } from './pharmacy-service.service';

describe('PharmacyServiceController', () => {
  let pharmacyServiceController: PharmacyServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyServiceController],
      providers: [PharmacyServiceService],
    }).compile();

    pharmacyServiceController = app.get<PharmacyServiceController>(PharmacyServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pharmacyServiceController.getHello()).toBe('Hello World!');
    });
  });
});
