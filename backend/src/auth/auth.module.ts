import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      // signOptions types can be strict; cast to any to accept env values
      signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '900s') as any },
    }),
  ],
  providers: [AuthService, PrismaService, UserService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
