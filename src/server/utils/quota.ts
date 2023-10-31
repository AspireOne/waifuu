import { User } from "@prisma/client";
import { prisma } from "../lib/db";

const MAX_DAILY_QUOTA = 3;

export const handleQuota = async (user: User): Promise<boolean> => {
    let quota = await prisma.userQuota.findFirst({
        where: {
            userId: user.id,
        }
    });

    if (!quota) {
        quota = await prisma.userQuota.create({
            data: {
                userId: user.id,
                messages: 1,
            }
        });

        return true;
    }

    const today = new Date();
    
    if (quota.quotaToDay.getDate() !== today.getDate()) {
        await prisma.userQuota.update({
            where: {
                id: quota.id,
            },
            data: {
                messages: 1,
            }
        });
        
        return true;
    }

    if (quota.messages >= MAX_DAILY_QUOTA) {
        return false;
    }

    await prisma.userQuota.update({
        where: {
            id: quota.id,
        },
        data: {
            messages: {
                increment: 1,
            }
        }
    });

    return true;
}