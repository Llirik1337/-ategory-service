import { BaseError } from '../../base.error';

export class CategoryAlreadyExistsError extends BaseError {
  static code = `CATEGORY_ALREADY_EXIST`;
  static message = `Category already exist`;
  constructor() {
    super(CategoryAlreadyExistsError.message, CategoryAlreadyExistsError.code);
  }
}
