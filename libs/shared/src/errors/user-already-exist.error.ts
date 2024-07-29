import { BaseError } from '../base-error';

export class UserAlreadyExistError extends BaseError {
  constructor() {
    super(`User already exist`, `USER_ALREADY_EXIST`);
  }
}
