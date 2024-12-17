import { HttpException, HttpStatus } from '@nestjs/common';

export class NotModifiedException extends HttpException {
  constructor(
    response: string | object,
    status: number = HttpStatus.NOT_MODIFIED,
  ) {
    super(response, status);
  }
}
