import { Document } from 'mongoose';

export interface Item extends Document {
  modifiedBy: IUserDocument;
}

export interface IUserDocument extends Item {
  email: string;
  password: string;
  role: string;
}



