import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiUseTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Token } from './dto/token.interface';

@ApiUseTags('auth')
@Controller("api/auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService, ) { }

    @ApiOperation({ title: 'Register new user' })
    @ApiCreatedResponse({ description: 'User sucessfully registered. Returns bearer token' })
    @ApiConflictResponse({ description: 'User with this email already exists.' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @Post("register")
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<Token> {
        return this.authService.register(registerUserDto);
    }

    @ApiOperation({ title: 'Authorize user' })
    @ApiCreatedResponse({ description: 'User authorized. New token returned.' })
    @ApiNotFoundResponse({ description: 'User With such credentials not found' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @Post("login")
    registerUloginser(@Body() credentials: Credentials): Promise<Token> {
        return this.authService.signIn(credentials);
    }
}