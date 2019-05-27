import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user: number;

    @Column({ length: 120, nullable: false, })
    title: string;

    @Column({ length: 120, nullable: false, })
    description: string;

    @Column({ length: 120, })
    image: string = "";

    @Column('datetime', { nullable: false, })
    createdAt: Date;

    @BeforeInsert()
    async createAt() {
        this.createdAt = new Date();
    }
    

}