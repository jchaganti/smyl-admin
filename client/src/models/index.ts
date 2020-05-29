export const ROLES = {
  ADMIN: 'ADMIN',
  CURATOR: 'CURATOR',
  PAYMENT_MANAGER: 'PAYMENT_MANAGER'
}

export interface User {
  email: string;
  role: string;
}