import { ModelsMap } from ".";
import { Secret } from "jsonwebtoken";
import DataLoader from "dataloader";

export interface Context {
  models: ModelsMap;
  me: string | object | undefined;
  secret: Secret,
  loaders: { [key: string]: DataLoader<string, any> },
}

export interface SignUpInput {
  email: string;
  password: string;
  role: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface CreateRetailerInput {
  name: string;
  categories: string[];
}

export interface AddCashbackInput {
  retailerId: string;
  category: string;
  cashbackPercent: Number;
}

export interface AssignCuratorInput {
  retailer: string;
  curator: string;
}

export enum USER_ROLE {
  ADMIN='ADMIN',
  CURATOR='CURATOR',
  PAYMENT_MANAGER='PAYMENT_MANAGER'
}