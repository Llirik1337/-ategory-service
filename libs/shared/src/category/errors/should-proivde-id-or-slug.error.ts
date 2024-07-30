import { BaseError } from '../../base.error';

export class ShouldProvideIdOrSlugError extends BaseError {
  constructor() {
    super(`Either id or slug must be provided`, `SHOULD_PROVIDE_ID_OR_SLUG`);
  }
}
