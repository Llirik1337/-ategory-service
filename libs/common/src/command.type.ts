export interface CommandType<RequestType, ResponseType = void> {
  request: RequestType;
  response: ResponseType;
}
