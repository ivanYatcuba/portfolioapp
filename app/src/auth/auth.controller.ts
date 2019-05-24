import { Controller, Get, Post, Body, ValidationPipe, UsePipes, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { User } from 'dist/src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Credentials } from 'src/auth/dto/credentials.dto';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller("api/auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService, ) { }

    @Post("register")
    @UsePipes(new ValidationPipe({ transform: true }))
    @SerializeOptions({
        excludePrefixes: ["password"]
    })
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        return this.userService.registerUser(registerUserDto);
    }

    @Get("login")
    @UsePipes(new ValidationPipe({ transform: true }))
    registerUloginser(@Body() credentials: Credentials): Promise<string> {
        return this.authService.signIn(credentials);
    }
}