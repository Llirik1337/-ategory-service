export class BaseError extends Error {
  constructor(message: string, private readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }

  public toHttp(): { code: string; message: string } {
    return {
      code: this.code,
      message: this.message,
    };
  }

  public toRpc(): {
    name: string;
    code: string;
    message: string;
    stack: string | undefined;
  } {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      stack: this.stack,
    };
  }
}
