import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordEncoder } from './passsword-encoder';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ClientsModule.register([
            { name: 'USER_SERVICE', transport: Transport.TCP },
        ]),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600,
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, PasswordEncoder],
    controllers: [AuthController],
    exports: [PasswordEncoder]
})
export class AuthModule { }