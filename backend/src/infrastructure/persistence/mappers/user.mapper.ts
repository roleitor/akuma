import { User as PrismaUser } from '@prisma-generated/client';
import { User } from '@domain/entities/user.entity';
import { UserRole } from '@shared/enums/user-role.enum';

export class UserMapper {
  static toDomain(entity: PrismaUser): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.passwordHash,
      entity.role as UserRole,
      entity.active,
      entity.createdAt,
    );
  }

  static toPersistence(domain: User): {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    active: boolean;
    createdAt: Date;
  } {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      passwordHash: domain.passwordHash,
      role: domain.role,
      active: domain.active,
      createdAt: domain.createdAt,
    };
  }
}
