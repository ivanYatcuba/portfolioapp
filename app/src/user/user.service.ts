import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Credentials } from '../auth/dto/credentials.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PasswordEncoder } from '../auth/passsword-encoder';
import { User } from './user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email: email });
    }

    async registerUser(userDto: RegisterUserDto): Promise<User> {
        const userExists = (await this.userRepository.count({ email: userDto.email })) > 0;
        if (userExists) {
            throw new ConflictException("User with this email already exists")
        }
        let user = new User();
        user.email = userDto.email;
        user.name = userDto.name;
        user.password = userDto.password;
        user.birthDay = new Date(userDto.birthday);
        user.phone = userDto.phone;
        return this.userRepository.save(user);
    }

    async getUserPasswordHash(id: number): Promise<string> {
        return this.userRepository
            .createQueryBuilder('user')
            .select('user.password')
            .where('user.id = :id', { id: id })
            .getRawOne().then((data) => {
                return data['user_password'];
            });
    }

    public async login(credentials: Credentials): Promise<User> {
        const user = await this.findByEmail(credentials.email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const passswordHash = await this.getUserPasswordHash(user.id);
        const logger = new Logger(UserService.name);

        logger.debug(passswordHash);

        if (new PasswordEncoder().compareHases(credentials.password, passswordHash)) {
            throw new NotFoundException("User not found");
        }

        return user;
    }
}