import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ItemController } from './item.controller';
import { Item } from './item.entity';
import { ItemService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), MulterModule.register({
    storage: diskStorage({
      destination: './items',
      filename: (_, file, cb) => {
        const randomName = Array(32).fill(null).map(() =>
          (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
  }),],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule { }
