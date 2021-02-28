import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import mikroConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { isAuth } from "./utils/isAuth";
import {createConnection } from 'typeorm';
import { User } from "./entities/User";
import { Post } from "./entities/Post";

const main = async () => {
    // sendEmail('hang@lian.com', 'hello ther')
    const conn = await createConnection({
        type: 'postgres',
        database: 'redditcopy',
        username: 'postgres',
        password: '5136200',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res, auth: isAuth(req, res) }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000", credentials: true },
        
    });
    app.listen(4000, () => {
        console.log("server started on localhost: 4000");
    });
};

main().catch((err) => console.log(err));
