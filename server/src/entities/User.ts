import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    public id!: number;

    @Field(() => String)
    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    @Field(() => String)
    public updatedAt: Date;

    @Field()
    @Column({ unique: true })
    public userName: string;

    @Field()
    @Column({ unique: true })
    public email!: string;

    @Field()
    @Column({ })
    public password!: string;
}
