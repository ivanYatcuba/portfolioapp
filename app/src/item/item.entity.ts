import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id)
    user: User;

    @Column({ length: 120 })
    title: string;

    @Column({ length: 120 })
    description: string;

    @Column({ length: 120 })
    image: string = "";

    @Column('datetime')
    createdAt: Date;

    @BeforeInsert()
    async createAt() {
        this.createdAt = new Date();
    }

}