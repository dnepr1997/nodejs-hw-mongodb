import { contactsCollection } from '../db/models/contacts.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constans/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
}) => {
  const skip = (page - 1) * perPage;
  const totalItems = await contactsCollection.find().countDocuments();
  const data = await contactsCollection
    .find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ page, perPage, totalItems });
  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = (id) => contactsCollection.findOne({ _id: id });

export const addContacts = (payload) => contactsCollection.create(payload);

export const updateContacts = async (_id, payload) => {
  const data = await contactsCollection.findOneAndUpdate({ _id }, payload, {});
  return data;
};

export const deleteContactsById = (_id) =>
  contactsCollection.findOneAndDelete({ _id });
