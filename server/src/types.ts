import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
    // em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: Session | any };
    res: Response;
    auth: { isAuth: boolean; token: any };
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>;
};
