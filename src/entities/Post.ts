import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
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
    @Property({ type: 'text' })
    public title!: string;
}
