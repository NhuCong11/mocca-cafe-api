const Joi = require('joi');
const { password, email, fullname, codeVerify } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    email: Joi.string().custom(email),
    password: Joi.string().custom(password),
  }),
};

const register = {
  body: Joi.object().keys({
    email: Joi.string().custom(email),
    password: Joi.string().custom(password),
    fullname: Joi.string().custom(fullname),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().custom(password),
    newPassword: Joi.string().custom(password),
  }),
};

const updateMe = {
  body: Joi.object().keys({
    fullname: Joi.string().optional().custom(fullname),
    dateOfBirth: Joi.date().allow(null, '').less('now'),
    gender: Joi.string().allow('male', 'female', ''),
    avatar: Joi.string(),
    background: Joi.string(),
    address: Joi.string().allow(null, ''),
    phone: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    background: Joi.string().allow(null, ''),
  }),
};

const toggle2FA = {
  body: Joi.object().keys({
    code: Joi.string().optional().custom(codeVerify),
  }),
};

const loginWith2FA = {
  body: Joi.object().keys({
    code: Joi.string().custom(codeVerify),
    token2FA: Joi.string().required(),
  }),
};

const change2FASecret = {
  body: Joi.object().keys({
    secret: Joi.string().required(),
    code: Joi.string().custom(codeVerify),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required().max(255),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(email),
    text: Joi.string().required(),
    sign: Joi.string().required(),
  }),
};

const verifyOTPForgotPassword = {
  body: Joi.object().keys({
    tokenForgot: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    tokenVerifyOTP: Joi.string().required(),
    newPassword: Joi.string().custom(password),
  }),
};

module.exports = {
  login,
  register,
  updateMe,
  refreshToken,
  changePassword,
  toggle2FA,
  loginWith2FA,
  change2FASecret,
  resetPassword,
  verifyEmail,
  forgotPassword,
  verifyOTPForgotPassword,
};
