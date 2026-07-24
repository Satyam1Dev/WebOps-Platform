import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const exists = await this.usersRepository.findByEmail(dto.email);

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);

    return this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password,
      role: dto.role,
      isActive: true,
      emailVerified: false,
    });
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.usersRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.usersRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
