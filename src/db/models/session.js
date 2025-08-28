import { model, Schema } from 'mongoose';
import { handleSaveErrors, saveUpdateSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

sessionSchema.post('save', handleSaveErrors); // спрацьовує після невдалого
sessionSchema.pre('findOneAndUpdate', saveUpdateSettings);
sessionSchema.post('findOneAndUpdate', handleSaveErrors);
export const sessionCollection = model('session', sessionSchema);
