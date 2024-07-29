import { BaseError } from '../base-error';

export class UserNotExistError extends BaseError {
  constructor() {
    super(`User not exist`, `USER_NOT_EXIST`);
  }
}
