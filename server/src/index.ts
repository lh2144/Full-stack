import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { isAuth } from "./utils/isAuth";
import cors from "cors";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
const main = async () => {
    // sendEmail('hang@lian.com', 'hello ther')
    const conn = await createConnection({
        type: "postgres",
        database: "redditcopy",
        username: "postgres",
        password: "5136200",
        logging: true,
        synchronize: true,
        entities: [Post, User],
    });

    const app = express();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
            auth: isAuth(req, res),
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader()
        }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log("server started on localhost: 4000");
    });
};

main().catch((err) => console.log(err));
