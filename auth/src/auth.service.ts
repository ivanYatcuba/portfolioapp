import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Credentials } from './dto/credentials.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService) { }

  async register(registerUserDto: RegisterUserDto) {
    return this.usersService.registerUser(registerUserDto).then(() => {
      return this.signIn(new Credentials(registerUserDto.email, registerUserDto.password));
    });

  }

  async signIn(credentials: Credentials) {
    const expiresIn = 6000 * 60;
    const user = await this.usersService.login(credentials);
    const token = this.jwtService.sign({ email: user.email, expiresIn: expiresIn });
    return { token: token };
  }

  async validateUser(signedUser: JwtPayload): Promise<User> {
    if (signedUser && signedUser.email) {
      return this.usersService.findByEmail(signedUser.email);
    }
  }
}