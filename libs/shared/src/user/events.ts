import { type EventType } from '@app/common';
import { type RegisterUserResponseDTO } from './dto';

export const events = {
  userRegistered: `user:user-registered`,
} satisfies Record<string, `user:${string}`>;

export interface EventsType {
  [events.userRegistered]: EventType<RegisterUserResponseDTO>;
}
