import { model, Schema } from 'mongoose';
import { handleSaveErrors, saveUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constans/auth.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true, //не дає повторюватись в рамках колекції
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);
userSchema.post('save', handleSaveErrors); // спрацьовує після невдалого
userSchema.pre('findOneAndUpdate', saveUpdateSettings);
userSchema.post('findOneAndUpdate', handleSaveErrors);
export const userCollection = model('user', userSchema);
