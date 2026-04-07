import { HttpStatus, Injectable } from '@nestjs/common';
import { SystemException } from '../exceptions/system.exception';

type TValidationError = {
  field: string;
  message: string;
};

@Injectable()
export class ExceptionService {
  exception(
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    message = 'Exception occurred',
  ): never {
    throw new SystemException({ status, message });
  }

  notFound<T>(dto: T | T[], message: string): void {
    if (Array.isArray(dto)) {
      if (dto.length < 1) {
        throw new SystemException({ status: HttpStatus.NOT_FOUND, message });
      }
    } else {
      if (!dto) {
        throw new SystemException({ status: HttpStatus.NOT_FOUND, message });
      }
    }
  }

  validationError(errors: TValidationError[]): never {
    throw new SystemException({
      status: HttpStatus.BAD_REQUEST,
      message: 'DTO Validation Error',
      errors: errors.reduce(
        (acc, error) => {
          acc[error.field] = { message: error.message };
          return acc;
        },
        {} as Record<string, { message: string }>,
      ),
    });
  }
}
