import mongoose, { Schema, Document, Model } from 'mongoose';
import userAudit from '../plugins/userAudit';
import { Item } from './item';

const CuratorRetailerSchema = new Schema({
  curator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  retailer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Retailer' 
  },
});


CuratorRetailerSchema.plugin(userAudit);

export interface ICuratorRetailerDocument extends Item {
  curator: string;
  retailer: string;
}

// Static methods
export interface ICuratorRetailerModel extends Model<ICuratorRetailerDocument> {
  findByCuratorRetailerAndDelete(curator: string, retailer: string): ICuratorRetailerDocument;
  findByCuratorId(curator: string): any;
}

CuratorRetailerSchema.static('findByCuratorRetailer', async function(this: ICuratorRetailerModel, curator: string, retailer: string) {
  const curatorRetailer = await this.findOneAndDelete({ curator, retailer });
  return curatorRetailer;
});

CuratorRetailerSchema.static('findByCuratorId', async function(this: ICuratorRetailerModel, curator: string) {
  const curatorRetailers = await this.find({ curator });
  return curatorRetailers;
});

const CuratorRetailer: ICuratorRetailerModel = mongoose.model<ICuratorRetailerDocument, ICuratorRetailerModel>('CuratorRetailer', CuratorRetailerSchema);

export default CuratorRetailer;