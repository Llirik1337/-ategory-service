import { CryptoService } from '@app/crypto';
import { UserRepository } from '../repositories';
import { type StringId } from '@app/mongodb';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@app/jwt';
import {
  InvalidPasswordError,
  type sharedUser,
  UserNotExistError,
} from '@app/shared';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    user: sharedUser.UserEntity,
  ): Promise<sharedUser.UserEntity & StringId> {
    const hashedPassword = await this.cryptoService.getHash(user.password);

    return this.userRepository.save({
      email: user.email,
      password: hashedPassword,
    });
  }

  async auth(
    params: Pick<sharedUser.UserEntity & StringId, 'email' | 'password'>,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findOne({
      email: params.email,
    });

    if (user == null) {
      throw new UserNotExistError();
    }

    const isValid = await this.cryptoService.compareHash(
      params.password,
      user.password,
    );

    if (!isValid) {
      throw new InvalidPasswordError();
    }

    const accessToken = this.jwtService.sign({
      id: user._id,
    });

    const refreshToken = this.jwtService.sign({
      id: user._id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
