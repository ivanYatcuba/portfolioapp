import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

import { User } from '../user/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './item.entity';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) { }

    createItem(currentUser: User, createItem: CreateItemDto): Promise<Item> {
        const item = new Item();
        item.user = currentUser;
        return this.itemRepository.save(Object.assign(item, createItem));
    }

    async updateItem(itemId: number, updateItem: UpdateItemDto): Promise<Item> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            throw new NotFoundException();
        }
        const updated = Object.assign(toUpdate, updateItem);
        return this.itemRepository.save(updated);
    }

    getItem(itemId: number): Promise<Item> {
        const item = this.itemRepository.findOne({ id: itemId });
        if (!item) {
            throw new NotFoundException();
        }
        return item;
    }

    async removeItem(itemId: number): Promise<Item> {
        const toRemove = await this.itemRepository.findOne({ id: itemId });
        if (!toRemove) {
            throw new NotFoundException();
        }
        return this.itemRepository
            .delete({ id: itemId })
            .then((_) => {
                return toRemove;
            });
    }
}
