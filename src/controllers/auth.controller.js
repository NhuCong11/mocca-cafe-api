const httpStatus = require('http-status');

const { env } = require('../config');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { authMessage, userMessage } = require('../messages');
const { REQUEST_USER_KEY, URL_HOST } = require('../constants');
const { authService, userService, cryptoService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken, twoFaToken } = await authService.login(email, password);
  if (user.is2FA) {
    return res
      .status(httpStatus.ACCEPTED)
      .json(response(httpStatus.ACCEPTED, authMessage().PLEASE_BYPASS_2FA, { twoFaToken }));
  }

  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, authMessage().LOGIN_SUCCESS, { user, accessToken, refreshToken }));
});

const register = catchAsync(async (req, res) => {
  const { fullname, email, password } = req.body;

  await authService.register(fullname, email, password);

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, authMessage().REGISTER_SUCCESS));
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  const { accessToken } = await authService.refreshToken(refreshToken);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().REFRESH_TOKEN_SUCCESS, { accessToken }));
});

const getMe = catchAsync(async (req, res) => {
  const user = req[REQUEST_USER_KEY];

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().GET_ME_SUCCESS, user));
});

const updateMe = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.fieldname === 'avatar') {
      req.body['avatar'] = req.file.path;
    }
  }

  const userId = req[REQUEST_USER_KEY].id;

  const user = await userService.updateUserById(userId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().UPDATE_ME_SUCCESS, user));
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const userId = req[REQUEST_USER_KEY].id;

  const user = await authService.changePassword(userId, oldPassword, newPassword);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().CHANGE_PASSWORD_SUCCESS, user));
});

const toggleTwoFactorAuthentication = catchAsync(async (req, res) => {
  const { code } = req.body;

  const userId = req[REQUEST_USER_KEY].id;

  const user = await authService.toggleTwoFactorAuthentication(userId, code);

  const messages = user.is2FA ? authMessage().ON_2FA_SUCCESS : authMessage().OFF_2FA_SUCCESS;

  res.status(httpStatus.OK).json(response(httpStatus.OK, messages, user));
});

const loginWith2FA = catchAsync(async (req, res) => {
  const { token2FA, code } = req.body;

  const { user, accessToken, refreshToken } = await authService.loginWith2FA(token2FA, code);

  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, authMessage().LOGIN_SUCCESS, { user, accessToken, refreshToken }));
});

const generate2FASecret = catchAsync(async (req, res) => {
  const secret = authService.generate2FASecret();

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().GENERATE_2FA_SUCCESS, { secret }));
});

const change2FASecret = catchAsync(async (req, res) => {
  const { secret, code } = req.body;

  const userId = req[REQUEST_USER_KEY].id;

  const user = await authService.change2FASecret(userId, secret, code);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().CHANGE_2FA_SUCCESS, user));
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  const originalToken = token.replaceAll(' ', '+');

  await authService.verifyEmail(originalToken);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().VERIFY_EMAIL_SUCCESS));
});

const reSendEmailVerify = catchAsync(async (req, res) => {
  const { token } = req.query;

  const originalToken = token.replaceAll(' ', '+');

  await authService.reSendEmailVerify(originalToken);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().RESEND_EMAIL_SUCCESS));
});

const renderPageVerifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  let payload, isExpired;

  try {
    const originalToken = token.replaceAll(' ', '+');
    ({ payload, isExpired } = cryptoService.expiresCheck(originalToken, env.secret.tokenVerify));
  } catch {
    return res.redirect(`${URL_HOST.production}/not-found`);
  }

  const user = await userService.getUserByEmail(payload.email);

  if (user?.isVerify) {
    return res.redirect(`${URL_HOST.production}/auth/login`);
  }

  if (isExpired) {
    return res.render('pages/resend-verify-email');
  }

  res.render('pages/verify-email');
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email, text, sign } = req.body;

  const tokenForgot = await authService.forgotPassword(email, text, sign);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().FORGOT_PASSWORD_SUCCESS, { tokenForgot }));
});

const verifyOTPForgotPassword = catchAsync(async (req, res) => {
  const { tokenForgot, otp } = req.body;

  const tokenVerifyOTP = await authService.verifyOTPForgotPassword(tokenForgot, otp);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().VERIFY_OTP_SUCCESS, { tokenVerifyOTP }));
});

const resetPassword = catchAsync(async (req, res) => {
  const { tokenVerifyOTP, newPassword } = req.body;

  await authService.resetPassword(tokenVerifyOTP, newPassword);

  res.status(httpStatus.OK).json(response(httpStatus.OK, authMessage().CHANGE_PASSWORD_SUCCESS));
});

const deleteMyAccount = catchAsync(async (req, res) => {
  const userId = req[REQUEST_USER_KEY].id;

  await userService.deleteMyAccount(userId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, userMessage().DELETE_ACCOUNT_SUCCESS));
});

module.exports = {
  getMe,
  login,
  register,
  updateMe,
  verifyEmail,
  refreshToken,
  loginWith2FA,
  resetPassword,
  forgotPassword,
  changePassword,
  change2FASecret,
  deleteMyAccount,
  generate2FASecret,
  reSendEmailVerify,
  renderPageVerifyEmail,
  verifyOTPForgotPassword,
  toggleTwoFactorAuthentication,
};
