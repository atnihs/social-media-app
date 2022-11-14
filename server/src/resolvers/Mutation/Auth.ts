import { JWT_SIGNATURE } from './../../keys';
import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

interface SignUpArgs {
    credentials: {
        email: string,
        password: string
    }
    name: string,
    bio: string,
}

interface SignIpArgs {
    credentials: {
        email: string,
        password: string
    }
}

interface UserPayload {
    userErrors: {
            message: string
        }[],
    token: string | null
}

export const authResolvers = {
    signup: async (_: any, { credentials, name, bio }: SignUpArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;
        const isEmail = validator.isEmail(email);
        if (!isEmail) {
            return {
                userErrors: [{ "message": "Invalid email !" }],
                token: null
            }
        }

        const isPassword = validator.isLength(password, { min: 3 });
        if (!isPassword) {
            return {
                userErrors: [{ "message": "Invalid password !" }],
                token: null
            }
        }

        if (!name || !bio) {
            return {
                userErrors: [{ "message": "Invalid name or bio !" }],
                token: null
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({ data: { email, name, password: hashedPassword }})

        await prisma.profile.create({ data: { bio, userId: user.id }});
        
        return {
            userErrors: [],
            token: JWT.sign({ userId: user.id }, JWT_SIGNATURE, { expiresIn: 3600000 })
        }
    },
    signin: async (_: any, { credentials }: SignIpArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({ where: { email }});

        if(!user) {
            return {
                userErrors: [{ "message": "Invalid credentials !" }],
                token: null
            }
        };

        const isMatchPwd = await bcrypt.compare(password, user.password);
        if(!isMatchPwd) {
            return {
                userErrors: [{ "message": "Invalid credentials !" }],
                token: null
            } 
        };


        return {
            userErrors: [],
            token: JWT.sign({ userId: user.id }, JWT_SIGNATURE, { expiresIn: 3600000 })
        }
    }
}