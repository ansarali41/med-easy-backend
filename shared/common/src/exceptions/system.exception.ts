import { HttpException, HttpStatus } from '@nestjs/common';

export type SystemExceptionErrors = Record<string, { message: string }>;

export class SystemException extends HttpException {
  constructor(params: {
    status: HttpStatus;
    message: string;
    errors?: SystemExceptionErrors;
  }) {
    super({ message: params.message, errors: params.errors }, params.status);
  }

  getErrors(): SystemExceptionErrors | undefined {
    const body = this.getResponse() as {
      errors?: SystemExceptionErrors;
    };
    return body.errors;
  }
}
