import { contactsCollection } from '../db/models/contacts.js';

export const getContacts = () => contactsCollection.find();

export const getContactsById = (id) => contactsCollection.findOne({ _id: id });

export const addContacts = (payload) => contactsCollection.create(payload);

export const updateContacts = async (_id, payload) => {
  const data = await contactsCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return data;
};

export const deleteContactsById = (_id) =>
  contactsCollection.findOneAndDelete({ _id });
