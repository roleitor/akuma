import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { KeyManagerImpl } from './ecdsa/key-manager.impl';
import { SignatureServiceImpl } from './ecdsa/signature-service.impl';
import { HashServiceImpl } from './hashing/hash-service.impl';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('security.jwtSecret'),
        signOptions: {
          expiresIn: (configService.get<string>('security.jwtExpiresIn') ?? '1h') as any,
        },
      }),
    }),
  ],
  providers: [
    KeyManagerImpl,
    {
      provide: 'SignatureService',
      useClass: SignatureServiceImpl,
    },
    {
      provide: 'HashService',
      useClass: HashServiceImpl,
    },
    JwtStrategy,
  ],
  exports: [
    KeyManagerImpl,
    'SignatureService',
    'HashService',
    JwtModule,
    PassportModule,
  ],
})
export class SecurityModule {}
