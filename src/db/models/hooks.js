export const handleSaveErrors = (error, doc, next) => {
  const { code, name } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export const saveUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
