const express = require('express');

const { env } = require('../../config');
const { uploadService } = require('../../services');
const { authController } = require('../../controllers');
const { authValidation } = require('../../validations');
const { auth } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const limiter = require('../../middlewares/rate-limit.middleware');
const { logAuthenticatedRequest } = require('../../middlewares/logger.middleware');

const authRouter = express.Router();

authRouter
  .route('/me')
  .get(auth, logAuthenticatedRequest, authController.getMe)
  .put(
    auth,
    logAuthenticatedRequest,
    uploadService.uploadImage.single('avatar'),
    validate(authValidation.updateMe),
    authController.updateMe,
  )
  .delete(auth, logAuthenticatedRequest, authController.deleteMyAccount);

authRouter.get('/verify', authController.renderPageVerifyEmail);

authRouter.post('/verify', validate(authValidation.verifyEmail), authController.verifyEmail);

authRouter.post('/resend-email-verify', validate(authValidation.verifyEmail), authController.reSendEmailVerify);

authRouter.use(limiter(env.rateLimit.timeAuth, env.rateLimit.totalAuth));

authRouter.post('/login', validate(authValidation.login), authController.login);

authRouter.post('/register', validate(authValidation.register), authController.register);

authRouter.post('/refresh-tokens', validate(authValidation.refreshToken), authController.refreshToken);

authRouter.post('/login-with-2fa', validate(authValidation.loginWith2FA), authController.loginWith2FA);

authRouter.post('/generate-2fa-secret', auth, logAuthenticatedRequest, authController.generate2FASecret);

authRouter.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);

authRouter.post(
  '/verify-otp-forgot-password',
  validate(authValidation.verifyOTPForgotPassword),
  authController.verifyOTPForgotPassword,
);

authRouter.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

authRouter.post(
  '/change-password',
  auth,
  logAuthenticatedRequest,
  validate(authValidation.changePassword),
  authController.changePassword,
);

authRouter.post(
  '/toggle-2fa',
  auth,
  logAuthenticatedRequest,
  validate(authValidation.toggle2FA),
  authController.toggleTwoFactorAuthentication,
);

authRouter.post(
  '/change-2fa-secret',
  auth,
  logAuthenticatedRequest,
  validate(authValidation.change2FASecret),
  authController.change2FASecret,
);

module.exports = authRouter;
