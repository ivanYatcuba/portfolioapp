import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from './jwt.strategy';
import { PasswordEncoder } from './passsword-encoder';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User]),
    ClientsModule.register([
        {
            name: 'AUTH_SERVICE',
            transport: Transport.TCP,
            options: { port: 3001 }
        },
    ]),],
    controllers: [UserController],
    providers: [UserService, PasswordEncoder, JwtStrategy],
    exports: [UserService],
})
export class UserModule { }

