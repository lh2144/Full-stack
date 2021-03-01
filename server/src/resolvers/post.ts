import { Updoot } from "src/entities/Updoot";
import { User } from "src/entities/User";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";

@InputType()
class PostInput {
    @Field()
    public title: string;
    @Field()
    public text: string;
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    public posts: Post[];
    @Field()
    public hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    public textSnippet(@Root() post: Post) {
        return post.text.slice(0, 50);
    }

    @FieldResolver(() => User)
    public creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(post.creatorId);
    }

    @FieldResolver(() => Int, { nullable: true })
    public async voteStatus(
        @Root() post: Post,
        @Ctx() { updootLoader, auth }: MyContext
    ) {
        if (!auth.token.id) {
            return null;
        }

        const updoot = await updootLoader.load({
            postId: post.id,
            userId: auth.token.id,
        });

        return updoot ? updoot.value : null;
    }

    @Mutation(() => Boolean)
    public async vote(
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { auth }: MyContext
    ) {
        const isUpdoot = value !== -1;
        const realval = isUpdoot ? 1 : -1;
        const { id: userId } = auth.token.id;

        const updoot = await Updoot.findOne({ where: { postId, userId } });

        if (updoot && updoot.value !== realval) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `update updoot
                    set value = $1
                    where "postId" = $2 and "userId" = $3`,
                    [realval, postId, userId]
                );

                await tm.query(
                    `update post
                    set points = points + $1
                    where id = $2`,
                    [2 * realval, postId]
                );
            });
        } else if (!updoot) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                insert into updoot ("userId", "postId", value)
                values ($1, $2, $3)
                    `,
                    [userId, postId, realval]
                );
                await tm.query(
                    `
                    update post
                    set points = points + $1
                    where id = $2
                      `,
                    [realval, postId]
                );
            });
        }
        return true;
    }

    @Query(() => PaginatedPosts)
    public async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
        @Ctx() {}: MyContext
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await getConnection().query(
            `
            select p.*
            from post p
            ${cursor ? `where p."createdAt" < $2` : ""}
            order by p."createdAt DESC
            limit $1"`,
            replacements
        );
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => Post, { nullable: true })
    public post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    public async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { auth }: MyContext
    ): Promise<Post> {
        if (auth.isAuth) {
            return Post.create({
                ...input,
                creatorId: auth.token.id,
            }).save();
        }
        return {} as Post;
    }

    @Mutation(() => Post, { nullable: true })
    public async updatPost(
        @Arg("title", () => String) title: string,
        @Arg("id", () => Int) id: number,
        @Arg("text") text: string,
        @Ctx() { auth }: MyContext
    ): Promise<Post | null> {
        if (auth.isAuth) {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Post)
                .set({ title, text })
                .where('id = :id and "creatorId" = :creatorId', {
                    id,
                    creatorId: auth.token.id,
                })
                .returning('*')
                .execute();
                return result.raw[0];
        }
        return null;
    }

    @Mutation(() => Boolean)
    public async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { auth }: MyContext
    ): Promise<boolean> {
        if (auth.isAuth) {
            await Post.delete({id, creatorId: auth.token.id});
            return true;
        }
        return false;
    }
}
