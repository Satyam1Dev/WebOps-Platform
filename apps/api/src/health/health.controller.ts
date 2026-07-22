import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

@Controller('health')
export class HealthController {
  private prisma = new PrismaClient();
  private redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      await this.redis.ping();
      return { status: 'ok', services: { database: 'connected', redis: 'connected' } };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
