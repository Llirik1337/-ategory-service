import { BaseError } from '../../base.error';

export class CategoryNotExistError extends BaseError {
  static code = `CATEGORY_NOT_EXIST`;
  static message = `Category not exist`;
  constructor() {
    super(CategoryNotExistError.message, CategoryNotExistError.code);
  }
}
