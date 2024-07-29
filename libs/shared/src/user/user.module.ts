import { MessageBusModule, MessageBusService } from '@app/message-bus';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [MessageBusModule],
  providers: [UserService, MessageBusService],
  exports: [UserService],
})
export class UserModule {}
