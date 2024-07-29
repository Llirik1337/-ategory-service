import { randomUUID } from 'crypto';
import { type StringId } from './string-id.interface';

export const addId = <T extends object>(data: T): T & StringId => {
  return Object.assign({}, data, { _id: randomUUID() });
};
