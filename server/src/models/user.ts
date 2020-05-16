import bcrypt from 'bcrypt';
import mongoose, { Schema, Document, Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    validate: [isEmail, 'No valid email address provided.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 42,
  },
  verificationStatus: {
    type: String,
    enum: ['VERIFIED', 'UNVERIFIED'],
    default: 'UNVERIFIED',
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'CURATOR', 'PAYMENT_MANAGER', 'UNDEFINED'],
    default: 'UNDEFINED',
    required: true
  }
});

export interface IUserDocument extends Document {
  email: string;
  password: string;
  role: string;
}

// Instance methods
export interface IUser extends IUserDocument {
  generatePasswordHash: () => string;
  validatePassword(password: string): boolean;
}

// Static methods
export interface IUserModel extends Model<IUser> {
  findByLogin(email: string): IUser;
}

UserSchema.pre<IUser>('save', async function( next: () => void) {
  this.password = await this.generatePasswordHash();
  next();
});

UserSchema.static('findByLogin', async function(this: IUserModel, email: string) {
  const user = await this.findOne({ email });
  return user;
});

UserSchema.method('generatePasswordHash', async function(this: IUser) {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);;
});

UserSchema.method('validatePassword', async function(this: IUser, password: string) {
  return await bcrypt.compare(password, this.password);
});

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;