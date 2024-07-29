import { sharedUser } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './services';
import { MessageBusService } from '@app/message-bus';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly messageBus: MessageBusService,
  ) {}

  @MessagePattern(sharedUser.commands.auth)
  async auth(
    @Payload() payload: sharedUser.AuthUserRequestDTO,
  ): Promise<sharedUser.AuthUserResponseDTO> {
    return this.userService.auth({
      email: payload.email,
      password: payload.password,
    });
  }

  @MessagePattern(sharedUser.commands.register)
  async register(
    @Payload() payload: sharedUser.RegisterUserRequestDTO,
  ): Promise<void> {
    const { email, password } = payload;

    const registerUser = await this.userService.register({
      email,
      password,
    });

    const { _id, ...user } = registerUser;

    await this.messageBus.emit(sharedUser.events.userRegistered, {
      id: _id,
      ...user,
    });
  }

  @MessagePattern(sharedUser.commands.logOut)
  logOut(
    @Payload() payload: sharedUser.LogOutRequestDTO,
  ): sharedUser.LogOutResponseDTO {
    return true;
  }
}
