import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from '@mikro-orm/core';
import path from "path";
import { User } from "./entities/User";

export  default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    user: 'postgres',
    dbName: 'redditcopy',
    host: 'localhost',
    type: 'postgresql',
    password: '5136200',
    debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];