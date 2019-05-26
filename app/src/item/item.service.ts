import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './item.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) { }

    createItem(currentUser: User, createItem: CreateItemDto): Promise<Item> {
        const item = new Item();
        item.title = createItem.title;
        item.description = createItem.description;
        item.user = currentUser;
        return this.itemRepository.save(item)
    }

}
