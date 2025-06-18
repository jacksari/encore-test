export const convertBigInts = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertBigInts);
  } else if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, any> = {};
    for (const key in obj) {
      const value = obj[key];
      result[key] =
        typeof value === 'bigint' ? Number(value) : convertBigInts(value);
    }
    return result;
  }
  return obj;
};
