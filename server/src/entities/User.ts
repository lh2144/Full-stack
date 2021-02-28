import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
    @PrimaryKey()
    @Field(() => Int)
    public id!: number;

    @Field(() => String)
    @Property({ type: 'date' })
    public createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    public updatedAt = new Date();

    @Field()
    @Property({ type: 'text', unique: true })
    public userName!: string;

    @Field()
    @Property({ type: 'text', unique: true })
    public email!: string;

    @Field()
    @Property({ type: 'text' })
    public password!: string;
}
