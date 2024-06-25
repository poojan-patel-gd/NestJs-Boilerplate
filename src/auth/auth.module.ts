import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SIGNATURE,
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
