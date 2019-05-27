import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './dto/create-item.dto';
import { ItemDto } from './dto/item-dto';
import { OrderType, SearchItemQuery } from './dto/item-search.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
    constructor(
        @Inject('USER_SERVICE') private readonly userService: ClientProxy,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) { }

    async createItem(currentUser: number, createItem: CreateItemDto): Promise<ItemDto> {
        const item = new Item();
        item.user = currentUser;

        const newItem = await this.itemRepository.save(Object.assign(item, createItem))
        return this.fetchUserInfoForItem(currentUser, newItem);
    }

    async updateItem(itemId: number, updateItem: UpdateItemDto, userId: number): Promise<ItemDto> {
        const toUpdate = await this.itemRepository.findOne({ id: itemId });
        if (!toUpdate) {
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            throw new ForbiddenException("You are not owner of this item");
        }
        const updated = Object.assign(toUpdate, updateItem);
        const updatedItem = await this.itemRepository.save(updated);
        return this.fetchUserInfoForItem(userId, updatedItem);
    }

    async updateItemImage(itemId: number, image: string, userId: number): Promise<ItemDto> {
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

        const updatedItem = await this.itemRepository.save(updated);
        return this.fetchUserInfoForItem(userId, updatedItem);
    }

    async deleteItemImage(itemId: number, userId: number): Promise<ItemDto> {
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

        const updatedItem = await this.itemRepository.save(updated);
        return this.fetchUserInfoForItem(userId, updatedItem);
    }

    async getItem(itemId: number, userId: number): Promise<ItemDto> {
        const item = await this.itemRepository.findOne({ id: itemId });
        if (!item) {
            throw new NotFoundException();
        }
        if (!await this.isMyItem(userId, itemId)) {
            throw new ForbiddenException("You are not owner of this item");
        }
        return this.fetchUserInfoForItem(userId, item);
    }

    async removeItem(itemId: number, userId: number): Promise<ItemDto> {
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
                return this.fetchUserInfoForItem(userId, toRemove);
            });
    }

    async searchItems(searchItemsDto: SearchItemQuery, userId: number): Promise<ItemDto[]> {
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

        const result = await qb.getMany();
        const mappedResult = result.map(async value => {
            return await this.fetchUserInfoForItem(userId, value);
        });
        return await Promise.all(mappedResult);
    }

    async isMyItem(userId: number, itemId: number): Promise<Boolean> {
        return (await this.itemRepository
            .count({
                id: itemId,
                user: userId,
            })) > 0;
    }

    async fetchUserInfoForItem(userId: number, item: Item): Promise<ItemDto> {
        let user = await this.userService.send({ cmd: "user-by-id" }, userId).toPromise();
        let dto = new ItemDto();
        dto.id = item.id;
        dto.title = item.title;
        dto.description = item.description;
        dto.image = item.image;
        dto.createdAt = item.createdAt;
        dto.user = user;
        return dto;
    }
}
