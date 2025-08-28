import { SORT_ORDER } from '../constans/contacts.js';

// export const parseSortParams = ({ sortBy, sortOrder }, sortFields) => {
//   const parsedSortOrder = sortList.includes(sortOrder)
//     ? sortOrder
//     : sortList[0];
//   const parsedSortBy = sortFields.includes(sortBy) ? sortBy : '_id';
//   return {
//     sortBy: parsedSortBy,
//     sortOrder: parsedSortOrder,
//   };
// };
const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) {
    return sortOrder;
  }
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keyOfContact = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavorite',
    'contactType',
  ];
  if (keyOfContact.includes(sortBy)) {
    return sortBy;
  }
  return 'name';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return { sortOrder: parsedSortOrder, sortBy: parsedSortBy };
};
