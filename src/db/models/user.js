// import { model, Schema } from 'mongoose';
// import { handleSaveErrors, saveUpdateSettings } from './hooks.js';
// import { emailRegexp } from '../../constans/auth.js';

// const userSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       match: emailRegexp,
//       unique: true, //не дає повторюватись в рамках колекції
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true, versionKey: false },
// );
// userSchema.post('save', handleSaveErrors); // спрацьовує після невдалого
// userSchema.pre('findOneAndUpdate', saveUpdateSettings);
// userSchema.post('findOneAndUpdate', handleSaveErrors);
// export const userCollection = model('user', userSchema);
import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: { type: String },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const userCollection = model('users', usersSchema);
