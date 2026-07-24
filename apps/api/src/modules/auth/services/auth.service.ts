import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenRepository } from '../refresh-token.repository';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  health() {
    return {
      message: 'Auth module ready',
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 12);

    const user = await this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password,
      role: dto.role,
      isActive: true,
      emailVerified: false,
    });

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );

    const refreshToken = await this.generateRefreshToken();

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    role: string,
  ) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      role,
    });
  }

  /**
   * Random opaque refresh token.
   * JWT refresh tokens can also be used,
   * but opaque tokens are easier to revoke.
   */
  private async generateRefreshToken() {
    return randomUUID() + randomUUID();
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ) {
    const tokenHash = await bcrypt.hash(refreshToken, 12);

    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() +
        this.getRefreshTokenLifetimeDays(),
    );

    await this.refreshTokenRepository.create(
      userId,
      tokenHash,
      expiresAt,
    );
  }

  private getRefreshTokenLifetimeDays() {
    const value = this.configService.getOrThrow<string>(
      'jwt.refreshExpiresIn',
    );

    if (value.endsWith('d')) {
      return Number(value.replace('d', ''));
    }

    return 7;
  }
}