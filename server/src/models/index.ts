import mongoose from 'mongoose';

import Message, {IMessageModel} from './message';
import User, { IUserModel } from './user';

const connectDb = () => {
  const url = (process.env.TEST_DATABASE_URL || process.env.DATABASE_URL) as string ;
  return mongoose.connect( url, { useNewUrlParser: true });
};

export type Models = IUserModel | IMessageModel;

export type ModelsMap = {[key: string]: Models};

const  models: ModelsMap = { User, Message };

export { connectDb };

export default models;
