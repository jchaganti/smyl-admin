import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../models/item';

const userAudit = (schema: Schema) => {

  schema.add({
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
  });
  
  schema.set('timestamps', true);
  
  schema.virtual('modifiedBy').set(function (this: any, user: IUserDocument) {
    if (this.isNew) {
      this.createdAt = this.updatedAt = new Date;
      this.createdBy = this.updatedBy = user && user.id;
    } else {
      this.updatedAt = new Date;
      this.updatedBy = user && user.id;
    }
  });
}

export default userAudit;