import os, json
import aioredis

redis = aioredis.from_url(os.getenv("REDIS_URL", "redis://redis:6379"))

async def get_pending_deliveries(driver_id: str):
    key = f"driver:{driver_id}:pending"
    items = await redis.lrange(key, 0, -1)
    return [json.loads(item) for item in items]
