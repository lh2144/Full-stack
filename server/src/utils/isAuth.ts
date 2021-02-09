import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const isAuth = (req: Request, _: any): boolean => {
    let token = req.get('Authorization');
    if (!token) {
         return false; 
    }
    token = token.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'hanglian');
        if (!decoded) {
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }

};