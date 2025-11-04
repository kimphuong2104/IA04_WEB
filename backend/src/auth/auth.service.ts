import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { LoginDto, RefreshDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.login(dto as any);
    if (!user) throw new UnauthorizedException('Invalid credentials');

  const payload: any = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '900s') as any,
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    } as any);

    // store refresh token expiry (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await (this.prisma as any).refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        revoked: false,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async refresh(dto: RefreshDto) {
    const record = await (this.prisma as any).refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!record || record.revoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // check expiry
    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

  const payload: any = { sub: record.user.id, email: record.user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '900s') as any,
    } as any);

    return { accessToken };
  }

  async logout(dto: RefreshDto) {
    const record = await (this.prisma as any).refreshToken.findUnique({
      where: { token: dto.refreshToken },
    });
    if (record) {
      await (this.prisma as any).refreshToken.update({
        where: { id: record.id },
        data: { revoked: true },
      });
    }
    return { ok: true };
  }
}
