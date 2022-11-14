import { Context } from './../index';

interface ProfileParentType {
    id: number,
    bio: string,
    userId: number
}

export const Profile = {
    user: (parent: ProfileParentType, __: any, { prisma, userInfo }: Context) => {
        return prisma.user.findUnique({ where: { id: parent.userId }})
    }
}