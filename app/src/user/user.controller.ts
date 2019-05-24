import { Controller, Get, Post, Body, ValidationPipe, UsePipes, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './register-user.dto';
import { debug } from 'util';
import { User } from 'dist/src/user/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller("api")
export class UserController {
    constructor(private readonly appService: UserService) { }

    @Post("register")
    @UsePipes(new ValidationPipe({ transform: true }))
    @SerializeOptions({
        excludePrefixes: ["password"]
    })
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        return this.appService.registerUser(registerUserDto);
    }
}
