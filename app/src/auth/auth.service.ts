import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async validateUser(token: string): Promise<any> {
    //TODO
    //return await this.usersService.findOneByToken(token);

    return null;
   }
}