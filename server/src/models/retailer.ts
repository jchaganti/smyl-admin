import mongoose, { Schema, Document, Model } from 'mongoose';
import isURL from 'validator/lib/isURL';
import userAudit from '../plugins/userAudit';
import { Item } from './item';

const RetailerSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  url: {
    type: String,
    validate: [isURL, 'No valid url provided.'],
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    cashbackPercent: {
      type: Number
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  }]
});

RetailerSchema.plugin(userAudit);

export interface IRetailerDocument extends Item {
  name: string;
  url?: string;
  categories: string [];
  sysUser: string;
}

// Static methods
export interface IRetailerModel extends Model<IRetailerDocument> {
  
}

const Retailer: IRetailerModel = mongoose.model<IRetailerDocument, IRetailerModel>('Retailer', RetailerSchema);

export default Retailer;