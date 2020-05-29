import jwtDecode from 'jwt-decode';

export const cast = <T extends unknown>(o: unknown): T => {
  return o as T;
}

export const getRole = (accessToken: string) =>  accessToken? (jwtDecode(accessToken) as any).role: '';

export const getEmail = (accessToken: string) =>  accessToken? (jwtDecode(accessToken) as any).email: '';