import mongoose from 'mongoose';

import Message, {IMessageModel} from './message';
import User, { IUserModel } from './user';
import Retailer, {IRetailerModel} from './retailer';

const connectDb = () => {
  const url = (process.env.TEST_DATABASE_URL || process.env.DATABASE_URL) as string ;
  return mongoose.connect( url, { useNewUrlParser: true });
};

export type Models = IUserModel | IMessageModel | IRetailerModel ;

export type ModelsMap = {[key: string]: Models};

const  models: ModelsMap = { User, Message, Retailer };

export { connectDb };

export default models;
