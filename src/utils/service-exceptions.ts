export abstract class ServiceException extends Error {
  public code: number;
  public details?: any;

  constructor (message: string, code: number) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

export class BadRequestException extends ServiceException {
  constructor (message: string) {
    super(message, 400);
  }
}

export class ValidationException extends ServiceException {
  details: any;
  constructor (details: { field: string, message: string }[]) {
    super('Validation Failed', 422);
    this.details = details.reduce((acc, { field, message }) => {
      acc[field] = `"${field}" ${message}`;
      return acc
    }, {});
  }
}

export class UnauthorizedException extends ServiceException {
  constructor (message: string) {
    super(message, 401);
  }
}

export class InternalServerErrorException extends ServiceException {
  constructor (message: string) {
    super(message, 500);
  }
}

export class ExpectationFailedException extends ServiceException {
  constructor (message: string) {
    super(message, 417);
  }
}

export class ServiceUnavailableException extends ServiceException {
  constructor (message: string) {
    super(message, 503);
  }
}

export class NotFoundException extends ServiceException {
  constructor (message: string) {
    super(message, 404);
  }
}

export class FailedRestoreException extends ServiceException {
  constructor (message: string) {
    super(message, 404);
  }
}

export class FailedRotationStatusUpdateException extends ServiceException {
  constructor (message: string) {
    super(message, 404);
  }
}

export class ForbiddenRequestException extends ServiceException {
  constructor (message?: string) {
    super(message ?? 'You are not authorized to perform this action', 403);
  }
}
