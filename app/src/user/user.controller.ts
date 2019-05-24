import { Controller, Get, UseGuards, SerializeOptions } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './user.decorator';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller("api/user")
export class UserController {
    constructor(
        private readonly userService: UserService, ) { }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    @SerializeOptions({
        excludePrefixes: ["password"]
    })
    getMyUserInfo(@CurrentUser('email') email: string): Promise<User> {
        return this.userService.findByEmail(email);
    }
}
