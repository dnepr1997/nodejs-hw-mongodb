import { contactsCollection } from '../db/models/contacts.js';

export const getContacts = () => contactsCollection.find();

export const getContactsById = (id) => contactsCollection.findOne({ _id: id });
