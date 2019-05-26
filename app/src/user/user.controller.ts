import { Body, Controller, Get, Param, Put, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdateUserDto } from './update-user.dto';
import { CurrentUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller("api/user")
export class UserController {
    constructor(
        private readonly userService: UserService, ) { }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    getMyUserInfo(@CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.findById(currentUserId);
    }

    @Put()
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
}
