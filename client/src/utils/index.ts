
export const cast = <T extends unknown>(o: unknown): T => {
  return o as T;
}