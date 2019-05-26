import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    async updateItem(itemId: number, updateItem: UpdateItemDto, userId: number): Promise<Item> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            throw new ForbiddenException("You are not owner of this item");
        }
        const updated = Object.assign(toUpdate, updateItem);
        return this.itemRepository.save(updated);
    }

    async updateItemImage(itemId: number, image: string, userId: number): Promise<Item> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            const fs = require('fs');
            fs.unlinkSync(image);
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            const fs = require('fs');
            fs.unlinkSync(image);
            throw new ForbiddenException("You are not owner of this item");
        }
        const updated = Object.assign(toUpdate, { image: image });
        return this.itemRepository.save(updated);
    }

    async deleteItemImage(itemId: number, userId: number): Promise<Item> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            throw new ForbiddenException("You are not owner of this item");
        }
        const fs = require('fs');
        fs.unlinkSync(toUpdate.image);
        const updated = Object.assign(toUpdate, { image: "" });
        return this.itemRepository.save(updated);
    }

    async getItem(itemId: number, userId: number): Promise<Item> {
        const item = await this.itemRepository.findOne({ id: itemId });
        if (!item) {
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            throw new ForbiddenException("You are not owner of this item");
        }
        return item;
    }

    async removeItem(itemId: number, userId: number): Promise<Item> {
        const toRemove = await this.itemRepository.findOne({ id: itemId });
        if (!toRemove) {
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            throw new ForbiddenException("You are not owner of this item");
        }
        return this.itemRepository
            .delete({ id: itemId })
            .then((_) => {
                return toRemove;
            });
    }

    async searchItems(searchItemsDto: SearchItemQuery, userId: number) {
        const qb = await this.itemRepository.createQueryBuilder('item')

        qb.where("1 = 1");

        if (searchItemsDto.title) {
            qb.andWhere("item.title LIKE :title", { title: `%${searchItemsDto.title}%` });
        }

        if (searchItemsDto.description) {
            qb.andWhere("item.description = :description", { description: `%${searchItemsDto.description}%` });
        }

        const order = searchItemsDto.orderBy == "asc" ? "ASC" : "DESC";

        qb.orderBy(`${OrderType[searchItemsDto.orderType]}`, order);
        qb.andWhere("item.user = :user", { user: userId })
        qb.leftJoinAndSelect("item.user", "user");
        return qb.getMany();
    }

    async isMyItem(userId: number, itemId: number): Promise<Boolean> {
        return (await this.itemRepository
            .count({
                id: itemId,
                user: Object.assign(new User(), { id: userId }
                )
            })) > 0;
    }
}
