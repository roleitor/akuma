import { UserRole } from '@shared/enums/user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole,
    public active: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(id: string, name: string, email: string, passwordHash: string, role: UserRole = UserRole.TECHNICIAN): User {
    return new User(id, name, email, passwordHash, role, true, new Date());
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
  }

  activate(): void {
    this.active = true;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
