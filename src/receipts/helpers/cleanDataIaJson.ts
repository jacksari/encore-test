export const cleanDataIaJson = (message: string) => {
  const cleaned = message
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
  return cleaned;
};
