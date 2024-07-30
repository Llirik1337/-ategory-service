import { MessageBusModule, MessageBusService } from '@app/message-bus';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';

@Module({
  imports: [MessageBusModule],
  providers: [CategoryService, MessageBusService],
  exports: [CategoryService],
})
export class CategoryModule {}
