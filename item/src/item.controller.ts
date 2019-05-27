import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
    ApiUseTags,
} from '@nestjs/swagger';

import { CreateItemDto } from './dto/create-item.dto';
import { ItemDto } from './dto/item-dto';
import { SearchItemQuery } from './dto/item-search.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Rpc2HttpExceptionFilter } from './exception/rpc-http-exception.filter';
import { ItemService } from './item.service';
import { CurrentUser } from './user.decorator';

@ApiBearerAuth()
@ApiUseTags('item')
@Controller('api/item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService, ) { }

    @ApiOperation({ title: 'Create new item' })
    @ApiCreatedResponse({ description: 'New item created' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Put()
    @HttpCode(201)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(Rpc2HttpExceptionFilter)
    @UseFilters(Rpc2HttpExceptionFilter)
    createItem(
        @Body() createItemDto: CreateItemDto,
        @CurrentUser('id') currentUserId: number): Promise<ItemDto> {
        return this.itemService.createItem(currentUserId, createItemDto);
    }

    @ApiOperation({ title: 'Update existing item' })
    @ApiOkResponse({ description: 'Item updated' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Put(":id")
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(Rpc2HttpExceptionFilter)
    updateItem(
        @Param('id') id: number,
        @CurrentUser('id') currentUserId: number,
        @Body() updateItemDto: UpdateItemDto): Promise<ItemDto> {
        return this.itemService.updateItem(id, updateItemDto, currentUserId);
    }

    @ApiOperation({ title: 'Get existing item by id' })
    @ApiOkResponse({ description: 'Item details' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(Rpc2HttpExceptionFilter)
    getItem(
        @Param('id') id: number,
        @CurrentUser('id') currentUserId: number): Promise<ItemDto> {
        return this.itemService.getItem(id, currentUserId);
    }

    @ApiOperation({ title: 'Remove item by id' })
    @ApiOkResponse({ description: 'Removed item details' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(Rpc2HttpExceptionFilter)
    deleteItem(
        @Param('id') id: number,
        @CurrentUser('id') currentUserId: number): Promise<ItemDto> {
        return this.itemService.removeItem(id, currentUserId);
    }

    @ApiOperation({ title: 'Attach image to item' })
    @ApiCreatedResponse({ description: 'Image successfuly added' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Post(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    @UseFilters(Rpc2HttpExceptionFilter)
    uploadItemFile(
        @Param('id') id: number,
        @CurrentUser('id') currentUserId: number,
        @UploadedFile() file) {
        return this.itemService.updateItemImage(id, file.path, currentUserId);
    }

    @ApiOperation({ title: 'Remove image from item' })
    @ApiOkResponse({ description: 'Image successfuly removed' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Delete(':id/image')
    @UseFilters(Rpc2HttpExceptionFilter)
    deleteFile(
        @Param('id') id: number,
        @CurrentUser('id') currentUserId: number): Promise<ItemDto> {
        return this.itemService.deleteItemImage(id, currentUserId);
    }

    @ApiOperation({ title: 'Search items by filter' })
    @ApiOkResponse({ description: 'Filtered items' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Get()
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(Rpc2HttpExceptionFilter)
    searchItems(
        @Query() itemSearchQuery: SearchItemQuery,
        @CurrentUser('id') currentUserId: number): Promise<ItemDto[]> {
        return this.itemService.searchItems(itemSearchQuery, currentUserId);
    }
}
