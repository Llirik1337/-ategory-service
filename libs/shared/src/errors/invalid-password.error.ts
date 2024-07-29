import { BaseError } from '../base-error';

export class InvalidPasswordError extends BaseError {
  constructor() {
    super(`Invalid password`, `INVALID_PASSWORD`);
  }
}
