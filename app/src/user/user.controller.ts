import { Body, Controller, Get, Param, Put, UseGuards, NotFoundException, Query, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';
import { SearchUserQuery } from './dto/search-user-query.dto';

@Controller("api/user")
export class UserController {
    constructor(
        private readonly userService: UserService, ) { }

    @Get("me")
    @UseGuards(AuthGuard("jwt"))
    getMyUserInfo(@CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.findById(currentUserId);
    }

    @Put("me")
    @UseGuards(AuthGuard("jwt"))
    updateMyUserInfo(
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.updateUser(currentUserId, updateUserDto);
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async getUserById(@Param('id') id: number): Promise<User> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async searchUsers(@Query() userSearchQuery: SearchUserQuery): Promise<User[]> {
        return this.userService.findUsers(userSearchQuery);
    }
}
