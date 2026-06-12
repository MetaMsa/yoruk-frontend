import { redis } from "./redis";

export async function isAllowed(ip: string, limit: number){

    const key = "next:rate:ip:" + ip;

    const count = await redis.incr(key);

    if (count == 1) {
        await redis.expire(key, 60);
    }

    return count != null  && count <= limit;
}