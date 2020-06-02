export const ROLES = {
  ADMIN: 'ADMIN',
  CURATOR: 'CURATOR',
  PAYMENT_MANAGER: 'PAYMENT_MANAGER'
}

export interface User {
  email: string;
  role: string;
}

export interface Category {
  name: string;
  cashbackPercent: number | null;
  
}

export interface Retailer {
  id: string;
  name: string;
  categories?: Category [] | undefined;
}
export interface Retailers {
  retailers: Retailer[];
}
export interface RetailersData {
  data : Retailers
}

export interface User {
  id: string
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  retailers?: Retailer [];
}
export interface Users {
  users: User [];
}
export interface UsersData {
  data : Users
}


export interface Curators {
  curators: User [];
}
export interface CuratorsData {
  data : Curators
}