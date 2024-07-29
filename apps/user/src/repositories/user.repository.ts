import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectCollection } from 'nestjs-mongodb-native';
import { Collection, addId, type StringId } from '@app/mongodb';
import { UserAlreadyExistError, type sharedUser } from '@app/shared';

@Injectable()
export class UserRepository implements OnModuleInit {
  constructor(
    @InjectCollection(`users`)
    private readonly collection: Collection<sharedUser.UserEntity & StringId>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.collection.createIndex({ email: 1 }, { unique: true });
  }

  async deleteById(params: StringId): Promise<void> {
    await this.collection.deleteOne(params);
  }

  async findOne(
    filter: Partial<sharedUser.UserEntity & StringId>,
  ): Promise<(sharedUser.UserEntity & StringId) | null> {
    return this.collection.findOne(filter);
  }

  async save(
    user: sharedUser.UserEntity,
  ): Promise<sharedUser.UserEntity & StringId> {
    const existingUser = await this.findOne({ email: user.email });

    if (existingUser != null) {
      throw new UserAlreadyExistError();
    }

    const result = await this.collection.insertOne(addId(user));

    return {
      ...user,
      _id: result.insertedId,
    };
  }
}
