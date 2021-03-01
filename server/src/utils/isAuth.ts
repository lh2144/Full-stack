import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const isAuth = (req: Request, _: any): {isAuth: boolean, token: any} => {
    let token = req.get('Authorization');
    if (!token) {
         return {
             isAuth: false,
             token : ''
         }; 
    }
    token = token.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'hanglian');
        if (!decoded) {
            return {
                isAuth: false,
                token: ''
            };
        }
        return {
            isAuth: true,
            token: decoded
        };
    } catch (err) {
        return {
            isAuth: false,
            token: ''
        };
    }

};