import { model, Schema } from 'mongoose';
import { typeList } from '../../constans/contacts.js';
import { handleSaveErrors, saveUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      required: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'Personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactsSchema.post('save', handleSaveErrors); // спрацьовує після невдалого
contactsSchema.pre('findOneAndUpdate', saveUpdateSettings);
contactsSchema.post('findOneAndUpdate', handleSaveErrors);
export const contactsSortFields = [
  'name',
  'phoneNumber',
  'email',
  'isfavorite',
  'contactType',
];
export const contactsCollection = model('contacts', contactsSchema);
