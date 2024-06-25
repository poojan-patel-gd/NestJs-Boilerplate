import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  [x: string]: any;
  constructor() {
    super();
  }

  async onModuleInit() {
    console.log('onModuleInit');
    await this.$connect();
  }

  async onModuleDestroy() {
    console.log('onModuleDestroy');
    await this.$disconnect();
  }
}
