import {
    Field,
    InputType
} from "type-graphql";


@InputType()
export class UserNamePasswordInput {
    @Field()
    public userName: string;
    @Field()
    public password: string;
    @Field()
    public email: string;
}
