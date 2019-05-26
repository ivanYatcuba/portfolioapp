import { ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Credentials } from '../auth/dto/credentials.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PasswordEncoder } from '../auth/passsword-encoder';
import { User } from './user.entity';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findById(id: number): Promise<User> {
        return this.userRepository.findOne({ id: id });
    }

    findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email: email });
    }

    async updateUser(currentUserId: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = new User();
        user.id = currentUserId;

        user.name = updateUserDto.name;
        if (updateUserDto.birthday) {
            user.birthDay = new Date(updateUserDto.birthday);
        }
        user.phone = updateUserDto.phone;

        if (updateUserDto.email) {
            const emailedUser = await this.findByEmail(updateUserDto.email)
            if (emailedUser) {
                if(emailedUser.id != currentUserId) {
                    throw new UnprocessableEntityException("Some other user already owns this email");
                }
            }
            user.email = updateUserDto.email;
        }

        if (updateUserDto.newPassword) {
            if (!updateUserDto.currentPassword) {
                throw new UnprocessableEntityException("Current password must not be empty");
            }
        }

        if (updateUserDto.currentPassword) {
            if (!updateUserDto.newPassword) {
                throw new UnprocessableEntityException("New password must not be empty");
            }
            const passswordHash = await this.getUserPasswordHash(currentUserId);
            const passwordEncoder = new PasswordEncoder();
            if (passwordEncoder.compareHases(updateUserDto.currentPassword, passswordHash)) {
                user.password = updateUserDto.newPassword;
            } else {
                throw new UnprocessableEntityException("Current password is wrong");
            }
        }

        return this.userRepository.save(user).then((update) => {
            return this.userRepository.findOne({ id: update.id });
        });
    }

    async registerUser(userDto: RegisterUserDto): Promise<User> {
        const userExists = (await this.userRepository.count({ email: userDto.email })) > 0;
        if (userExists) {
            throw new ConflictException("User with this email already exists");
        }
        const user = new User();
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
        if (!new PasswordEncoder().compareHases(credentials.password, passswordHash)) {
            throw new NotFoundException("User not found");
        }

        return user;
    }
}