import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema({
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

userSchema.statics.findByLogin = async function(email) {
  const user = await this.findOne({ email });
  return user;
};

userSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ userId: this._id }, next);
});

userSchema.pre('save', async function() {
  this.password = await this.generatePasswordHash();
});

userSchema.methods.generatePasswordHash = async function() {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
