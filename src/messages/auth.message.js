const { i18nService } = require('../config');

const authMessage = () => {
  return {
    FORBIDDEN: i18nService.translate('auth.forbidden'),
    JWT_EXPIRED: i18nService.translate('auth.jwtExpired'),
    PLEASE_WAIT: i18nService.translate('auth.pleaseWait'),
    INVALID_OTP: i18nService.translate('auth.invalidOTP'),
    UNAUTHORIZED: i18nService.translate('auth.unauthorized'),
    INVALID_LOGIN: i18nService.translate('auth.invalidLogin'),
    LOGIN_SUCCESS: i18nService.translate('auth.loginSuccess'),
    INVALID_TOKEN: i18nService.translate('auth.invalidToken'),
    TOKEN_EXPIRED: i18nService.translate('auth.tokenExpired'),
    GET_ME_SUCCESS: i18nService.translate('auth.getMeSuccess'),
    ON_2FA_SUCCESS: i18nService.translate('auth.on2FASuccess'),
    OFF_2FA_SUCCESS: i18nService.translate('auth.off2FASuccess'),
    INVALID_2FA_CODE: i18nService.translate('auth.invalid2FACode'),
    EMAIL_NOT_EXISTS: i18nService.translate('auth.emailNotExists'),
    REGISTER_SUCCESS: i18nService.translate('auth.registerSuccess'),
    INVALID_PASSWORD: i18nService.translate('auth.invalidPassword'),
    UPDATE_ME_SUCCESS: i18nService.translate('auth.updateMeSuccess'),
    PLEASE_BYPASS_2FA: i18nService.translate('auth.pleaseBypass2FA'),
    LENGTH_CODE_VERIFY: i18nService.translate('auth.lengthCodeVerify'),
    CHANGE_2FA_SUCCESS: i18nService.translate('auth.change2FASuccess'),
    VERIFY_OTP_SUCCESS: i18nService.translate('auth.verifyOTPSuccess'),
    PLEASE_VERIFY_EMAIL: i18nService.translate('auth.pleaseVerifyEmail'),
    GENERATE_2FA_SUCCESS: i18nService.translate('auth.generate2FASuccess'),
    VERIFY_EMAIL_SUCCESS: i18nService.translate('auth.verifyEmailSuccess'),
    RESEND_EMAIL_SUCCESS: i18nService.translate('auth.resendEmailSuccess'),
    REFRESH_TOKEN_SUCCESS: i18nService.translate('auth.refreshTokenSuccess'),
    CHANGE_PASSWORD_SUCCESS: i18nService.translate('auth.changePasswordSuccess'),
    FORGOT_PASSWORD_SUCCESS: i18nService.translate('auth.forgotPasswordSuccess'),
    INVALID_TOKEN_VERIFY_EXPIRED: i18nService.translate('auth.invalidTokenVerifyExpired'),
  };
};

module.exports = authMessage;
