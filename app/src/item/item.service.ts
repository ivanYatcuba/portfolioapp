import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { OrderBy, OrderType, SearchItemQuery } from './dto/item-search.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';

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

    async updateItemImage(itemId: number, image: string): Promise<Item> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            const fs = require('fs');
            fs.unlinkSync(image);
            throw new NotFoundException();
        }
        const updated = Object.assign(toUpdate, { image: image });
        return this.itemRepository.save(updated);
    }

    async deleteItemImage(itemId: number): Promise<Item> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            throw new NotFoundException();
        }
        const fs = require('fs');
        fs.unlinkSync(toUpdate.image);
        const updated = Object.assign(toUpdate, { image: "" });
        return this.itemRepository.save(updated);
    }

    async getItem(itemId: number): Promise<Item> {
        const item = await this.itemRepository.findOne({ id: itemId });
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

    async searchItems(searchItemsDto: SearchItemQuery) {
        const qb = await this.itemRepository.createQueryBuilder('item')

        qb.where("1 = 1");

        if (searchItemsDto.title) {
            qb.andWhere("item.title LIKE :title", { title: `%${searchItemsDto.title}%` });
        }

        if (searchItemsDto.userId) {
            qb.andWhere("item.user = :userId", { userId: searchItemsDto.userId });
        }

        const order = searchItemsDto.orderBy == OrderBy.asc ? "ASC" : "DESC";

        qb.orderBy(`${OrderType[searchItemsDto.orderType]}`, order);
        qb.leftJoinAndSelect("item.user", "user");
        return qb.getMany();
    }
}
