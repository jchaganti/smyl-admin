import mongoose, { Schema, Document, Model } from 'mongoose';

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

export interface IMessageDocument extends Document {
  text: String;
  userId:  mongoose.Schema.Types.ObjectId
}

export interface IMessageModel extends Model<IMessageDocument> {

}

const Message: IMessageModel  = mongoose.model<IMessageDocument, IMessageModel>('Message', messageSchema);

export default Message;
