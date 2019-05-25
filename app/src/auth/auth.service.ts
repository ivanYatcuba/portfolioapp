import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt';
import { Credentials } from './dto/credentials.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService) { }

  async signIn(credentials: Credentials) {
    const expiresIn = 6000 * 60;
    const user = await this.usersService.login(credentials)
    const token = this.jwtService.sign({ email: user.email, expiresIn: expiresIn });
    return token;
  }

  async validateUser(signedUser: JwtPayload): Promise<User> {
    if (signedUser && signedUser.email) {
      return this.usersService.findByEmail(signedUser.email);
    }
  }
}