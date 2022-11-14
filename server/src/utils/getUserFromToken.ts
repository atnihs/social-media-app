import { JWT_SIGNATURE } from './../keys';
import JWT from 'jsonwebtoken';

export const getUserFromToken = (token: string) => {
    try {
        return JWT.verify(token, JWT_SIGNATURE) as {
            userId: number
        };
    } catch (error) {
        return null;
    }
}