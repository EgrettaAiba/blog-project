import { getCache, setCache } from "../cache/memoryCache.js";

export const cacheMiddleware = (ttl = 60_000) => {
  return (req, res, next) => {
    const key = req.originalUrl;

    const cachedData = getCache(key);
    if (cachedData) {
      return res.json(cachedData);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      setCache(key, body, ttl);
      originalJson(body);
    };

    next();
  };
};
