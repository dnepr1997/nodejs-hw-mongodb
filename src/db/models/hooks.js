export const handleSaveErrors = (error, doc, next) => {
  error.status = 400;
  next();
};

export const saveUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
