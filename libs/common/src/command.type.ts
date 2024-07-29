export interface CommandType<RequestType, ResponseType> {
  request: RequestType;
  response: ResponseType;
}
