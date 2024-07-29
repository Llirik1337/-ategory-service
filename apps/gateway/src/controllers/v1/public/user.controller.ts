import { sharedUser } from '@app/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserAuthRequestDTO,
  UserAuthResponseDTO,
  UserRegisterRequestDTO,
} from '../../../dto';

@ApiTags(`user`)
@Controller(`v1/public/user`)
export class UserController {
  constructor(private readonly userService: sharedUser.UserService) {}

  @Post(`register`)
  public async register(
    @Body() payload: UserRegisterRequestDTO,
  ): Promise<void> {
    await this.userService.register(payload);
  }

  @Post(`auth`)
  @ApiResponse({ type: UserAuthResponseDTO })
  async auth(
    @Body() payload: UserAuthRequestDTO,
  ): Promise<UserAuthResponseDTO> {
    return this.userService.auth(payload);
  }
}
