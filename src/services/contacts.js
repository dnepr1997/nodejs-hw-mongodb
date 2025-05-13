import { contactsCollection } from '../db/models/contacts.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { SORT_ORDER } from '../constans/contacts.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  isFavorite,
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const contactsQuery = contactsCollection.find({ userId });
  if (typeof isFavorite === 'boolean') {
    contactsQuery.where('isFavorite').equals(isFavorite);
  }
  const contactsCount = await contactsCollection
    .find({ userId })
    .merge(contactsQuery)
    .countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calcPaginationData(contactsCount, perPage, page);
  return { data: contacts, ...paginationData };
};
// const query = contactsCollection.find();

// if (filter.userId) {
//   query.where('userId').equals(filter.userId);
// }
// if (filter.contactType) {
//   query.where('contactType').regex(new RegExp(filter.contactType, 'i'));
// }

// if (typeof filter.isFavorite === 'boolean') {
//   query.where('isFavorite').equals(filter.isFavorite);
// }

// const data = await query
//   .skip(skip)
//   .limit(perPage)
//   .sort({ [sortBy]: sortOrder });

// const totalItems = await query.clone().countDocuments();

// const paginationData = calcPaginationData({ page, perPage, totalItems });

// return {
//   data,
//   page,
//   perPage,
//   totalItems,
//   ...paginationData,
// };
// доопрацювання
// export const getContactsById = (id) => contactsCollection.findOne({ _id: id });
export const getContactsById = async (contactId, userId) => {
  const data = await contactsCollection.findOne({ _id: contactId, userId });
  return data;
};
export const addContacts = async (payload, userId) => {
  const contact = await contactsCollection.create({ ...payload, userId });
  return contact;
};

// export const updateContacts = async (_id, payload) => {
//   const data = await contactsCollection.findOneAndUpdate({ _id }, payload, {});
//   return data;
// };

export const updateContacts = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const contact = await contactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
    },
  );
  return contact;
};

// export const deleteContactsById = (_id) =>
//   contactsCollection.findOneAndDelete({ _id });

export const deleteContactsById = async (contactId, userId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
