const cache = new Map();

export const getCache = (key) => {
  const data = cache.get(key);
  if (!data) return null;

  // Проверяем TTL
  if (Date.now() > data.expireAt) {
    cache.delete(key);
    return null;
  }

  return data.value;
};

export const setCache = (key, value, ttl = 60_000) => {
  cache.set(key, {
    value,
    expireAt: Date.now() + ttl,
  });
};

export const clearCache = () => {
  cache.clear();
};
