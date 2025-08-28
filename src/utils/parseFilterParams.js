// const parseType = (contactType) => {
//   const isString = typeof contactType === 'string';
//   if (!isString) return;

const parseFavorite = (isFavorite) => {
  if (typeof isFavorite === 'string') {
    if (isFavorite.toLowerCase() === 'true') return true;
    if (isFavorite.toLowerCase() === 'false') return false;
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { isFavorite } = query;
  const parsedIsFavorite = parseFavorite(isFavorite);

  return { isFavorite: parsedIsFavorite };
};
