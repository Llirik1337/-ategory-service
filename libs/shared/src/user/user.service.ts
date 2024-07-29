import { MessageBusService } from '@app/message-bus';
import { Injectable } from '@nestjs/common';
import { commands } from './commands';
import { type UserEntity } from './entities';

@Injectable()
export class UserService {
  constructor(private readonly messageBus: MessageBusService) {}

  async register(user: UserEntity): Promise<void> {
    await this.messageBus.send(commands.register, user);
  }

  async auth(
    user: UserEntity,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    return this.messageBus.send(commands.auth, user);
  }
}
