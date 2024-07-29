import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { InjectCollection } from 'nestjs-mongodb-native';
import { addId, type StringId } from '@app/mongodb';
import { type sharedUser } from '@app/shared';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectCollection(`refresh-tokens`)
    private readonly collection: Collection<sharedUser.RefreshToken & StringId>,
  ) {}

  async deleteAllByUser(userId: string): Promise<void> {
    await this.collection.deleteMany({ userId });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.collection.deleteOne({ token: refreshToken });
  }

  async save(
    refreshToken: sharedUser.RefreshToken,
  ): Promise<sharedUser.RefreshToken & StringId> {
    const result = await this.collection.insertOne(addId(refreshToken));
    return {
      ...refreshToken,
      _id: result.insertedId,
    };
  }
}
