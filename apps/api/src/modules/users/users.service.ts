import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully',
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}