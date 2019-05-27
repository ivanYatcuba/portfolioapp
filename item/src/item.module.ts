import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ItemController } from './item.controller';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Item]), MulterModule.register({
    storage: diskStorage({
      destination: './items',
      filename: (_, file, cb) => {
        const randomName = Array(32).fill(null).map(() =>
          (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
  }),
  ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: { port: 3001 }
    },
  ]),
  ClientsModule.register([
    {
      name: 'USER_SERVICE',
      transport: Transport.TCP,
      options: { port: 4001 }
    },
  ]),
  ],
  controllers: [ItemController],
  providers: [ItemService, JwtStrategy]
})
export class ItemModule { }
