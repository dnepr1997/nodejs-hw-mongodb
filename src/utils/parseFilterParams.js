const parseType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;

  const isType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isType(contactType)) return contactType;
};

// const parseIsFavorite = (isFavorite) => {
//   const isBoolean = typeof isFavorite === 'boolean';
//   if (!isBoolean) return isFavorite;
// };

const parseIsFavorite = (isFavorite) => {
  if (isFavorite === 'true') return true;
  if (isFavorite === 'false') return false;
  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavorite } = query;

  const parsedContactType = parseType(contactType);
  const parsedIsFavorite = parseIsFavorite(isFavorite);

  return {
    contactType: parsedContactType,
    isFavorite: parsedIsFavorite,
  };
};
