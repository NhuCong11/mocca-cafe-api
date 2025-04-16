const { userMessage, contactMessage, authMessage, systemMessage } = require('../messages');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" ' + userMessage().INCORRECT_ID);
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(userMessage().PASSWORD_LENGTH);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(userMessage().PASSWORD_INVALID);
  }
  return value;
};

const email = (value, helpers) => {
  if (!value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
    return helpers.message(userMessage().EMAIL_INVALID);
  }
  return value;
};

const role = (value, helpers) => {
  if (!value.match(/^(admin|user|shop)$/)) {
    return helpers.message(userMessage().ROLE_INVALID);
  }
  return value;
};

const fullname = (value, helpers) => {
  if ((value && value.length < 3) || value.length > 50) {
    return helpers.message(userMessage().FULLNAME_LENGTH);
  }
  return value;
};

const phone = (value, helpers) => {
  if ((value && value.length < 8) || value.length > 13) {
    return helpers.message(userMessage().PHONE_LENGTH);
  }
  return value;
};

const message = (value, helpers) => {
  if (value === '' || !value) {
    return helpers.message(contactMessage().MESSAGE_REQUIRED);
  }
  if (value.length < 5 || value.length > 500) {
    return helpers.message(contactMessage().MESSAGE_LENGTH);
  }
  return value;
};

const codeVerify = (value, helpers) => {
  if (value.length !== 6 || !/^\d{6}$/.test(value)) {
    return helpers.message(authMessage().LENGTH_CODE_VERIFY);
  }
  return value;
};

const uriQRCode = (value, helpers) => {
  if (value.length < 5 || value.length > 100) {
    return helpers.message(systemMessage().URI_QR_INVALID);
  }
  return value;
};

const quantity = (value, helpers) => {
  if (value <= 0 || value > 100) {
    return helpers.message(systemMessage().QUANTITY_INVALID);
  }
  return value;
};

module.exports = {
  role,
  phone,
  email,
  message,
  objectId,
  password,
  fullname,
  quantity,
  uriQRCode,
  codeVerify,
};
