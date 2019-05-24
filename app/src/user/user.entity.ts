import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordEncoder } from 'src/auth/passsword-encoder';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    email: string;

    @Exclude()
    @Column('text')
    password: string;

    @Column({ length: 120 })
    name: string;

    @Column('datetime')
    birthDay: Date;

    @Column()
    phone: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = new PasswordEncoder().encodePassword(this.password);
    }
}