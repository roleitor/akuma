import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/ports/repositories/user-repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserMapper } from '@infrastructure/persistence/mappers/user.mapper';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.prisma.user.findUnique({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.prisma.user.findUnique({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const saved = await this.prisma.user.create({ data });
    return UserMapper.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const saved = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
    return UserMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }
}
