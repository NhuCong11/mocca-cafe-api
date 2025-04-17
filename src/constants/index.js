const LANGUAGE_DEFAULT = 'vi';

const LOCALES = ['en', 'vi', 'zh'];

const HEADER_NAME = 'accept-language';

const COOKIE_NAME = 'lang';

const REQUEST_USER_KEY = 'user';

const PATH_API_DEFAULT = '/api/v1';

const TIME_CACHE_DEFAULT = 60;

const QUEUE_TYPES = {
  EMAIL_QUEUE: 'email_queue',
};

const CODE_VERIFY_2FA_SUCCESS = [0, 2];

const LOGO_QRCODE_NAME = 'logo-qrcode.jpg';

const LOGO_SIZE = 320;

const HOST_NAME = 'mocca.io.vn';

const LOGO_MARGIN = 4;

const LOGO_IMAGE_MARGIN = 7;

const LOGO_DOTS_COLOR = '#101010';

const LOGO_BACKGROUND_COLOR = '#f6f6f6';

const LOG_DIR = 'logs';

const LOG_FILENAME = 'logger.log';

const URL_HOST = {
  production: 'https://api.mocca.io.vn',
  development: 'http://localhost:5000',
};

const URL_FRONTEND = {
  production: 'https://mocca.io.vn',
  development: 'http://localhost:3000',
};

const EXPIRES_TOKEN_EMAIL_VERIFY = 1000 * 60 * 10;

const EXPIRES_TOKEN_FOTGOT_PASSWORD = 1000 * 60 * 10;

const EXPIRES_TOKEN_VERIFY_OTP_FORGOT = 1000 * 60 * 10;

const EXPIRES_TOKEN_CAPTCHA = 1000 * 60 * 2;

const TIME_DIFF_EMAIL_VERIFY = 1000 * 60 * 3;

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  TWO_FA: 'twoFA',
  VERIFY: 'verify',
  FOTGOT: 'forgot',
  VERIFY_OTP: 'verify-otp',
};

const EMAIL_TYPES = {
  VERIFY: 'verify',
  FORGOT: 'forgot-password',
  BIRTHDAY: 'birthday',
  ORDER_CANCELED: 'order-canceled',
  ORDER_CONFIRMED: 'order-confirmed',
  ORDER_PENDING: 'order-pending',
  ORDER_REJECT: 'order-reject',
  ORDER_SHIPPING: 'order-shipping',
  ORDER_SUCCESS: 'order-success',
};

const EMAIL_SUBJECT = {
  VERIFY: '[Mocca Cafe] Verify your email address',
  FORGOT: '[Mocca Cafe] Confirm OTP Forgot Password',
  BIRTHDAY: '[Mocca Cafe] Happy Birthday',
  ORDER_CANCELED: '[Mocca Cafe] Your order has been canceled',
  ORDER_CONFIRMED: '[Mocca Cafe] Your order has been confirmed',
  ORDER_PENDING: '[Mocca Cafe] Your order is pending',
  ORDER_REJECT: '[Mocca Cafe] Your order has been rejected',
  ORDER_SHIPPING: '[Mocca Cafe] Your order is being shipped',
  ORDER_SUCCESS: '[Mocca Cafe] Your order was successful',
};

const STATUS_FORGOT = {
  DONE: null,
  VERIFIED: 'verified',
  VERIFY_OTP: 'verifyOTP',
};

const LENGTH_OTP_DEFAULT = 6;

const STYLE_EXPORT_EXCEL = {
  font: {
    color: '#FFFFFF',
    bold: true,
  },
  fill: {
    type: 'pattern',
    patternType: 'solid',
    fgColor: '#1ABD76',
  },
};

const KEY_CACHE_ACCESS = 'totalAccess';

const TTL_CACHE_ACCESS = 10 * 60;

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

const THIRTY_DAYS_IN_MILLISECONDS = 30 * MILLISECONDS_IN_A_DAY;

const RATING_RANGE = [3.5, 4, 4.5, 5];

const MAX_ORDER_PER_USER = 5;

const LIMIT_DEFAULT = 10;

const PAGE_DEFAULT = 1;

const LIMIT_DEFAULT_EXPORT = 10000;

const SORT_DEFAULT_STRING = 'createdAt:desc';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const USER_ROLE_ENUM = {
  ADMIN: 'admin',
  USER: 'user',
  SHOP: 'shop',
};

const BIRTHDAY_DEFAULT = '2000-01-01';

const USER_GENDER_ENUM = {
  MALE: 'male',
  FEMALE: 'female',
};

const USER_FORGOT_STATUS_ENUM = {
  NULL: null,
  VERIFIED: 'verified',
  VERIFY_OTP: 'verifyOTP',
};

const BASE_URL_CLOUD_TIKTOK = 'https://p21-ad-sg.ibyteimg.com/obj/ad-site-i18n-sg/';

const USER_AVATAR_DEFAULT = BASE_URL_CLOUD_TIKTOK + '202405225d0d8e5ebe1b948e4f91a687';

const USER_BACKGROUND_DEFAULT = BASE_URL_CLOUD_TIKTOK + '202406025d0d3193cbe6c8354ee9abc1';

const PRODUCT_IMAGE_DEFAULT = BASE_URL_CLOUD_TIKTOK + '202406025d0d0cc7ca85fe33492fb5e6';

module.exports = {
  LOG_DIR,
  LOCALES,
  URL_HOST,
  LOGO_SIZE,
  HOST_NAME,
  CHARACTERS,
  EMAIL_TYPES,
  COOKIE_NAME,
  TOKEN_TYPES,
  HEADER_NAME,
  QUEUE_TYPES,
  LOGO_MARGIN,
  URL_FRONTEND,
  RATING_RANGE,
  PAGE_DEFAULT,
  LOG_FILENAME,
  STATUS_FORGOT,
  LIMIT_DEFAULT,
  EMAIL_SUBJECT,
  USER_ROLE_ENUM,
  LOGO_DOTS_COLOR,
  BIRTHDAY_DEFAULT,
  TTL_CACHE_ACCESS,
  KEY_CACHE_ACCESS,
  LANGUAGE_DEFAULT,
  USER_GENDER_ENUM,
  REQUEST_USER_KEY,
  PATH_API_DEFAULT,
  LOGO_QRCODE_NAME,
  LOGO_IMAGE_MARGIN,
  TIME_CACHE_DEFAULT,
  LENGTH_OTP_DEFAULT,
  STYLE_EXPORT_EXCEL,
  MAX_ORDER_PER_USER,
  USER_AVATAR_DEFAULT,
  SORT_DEFAULT_STRING,
  LIMIT_DEFAULT_EXPORT,
  PRODUCT_IMAGE_DEFAULT,
  EXPIRES_TOKEN_CAPTCHA,
  LOGO_BACKGROUND_COLOR,
  MILLISECONDS_IN_A_DAY,
  TIME_DIFF_EMAIL_VERIFY,
  CODE_VERIFY_2FA_SUCCESS,
  USER_FORGOT_STATUS_ENUM,
  USER_BACKGROUND_DEFAULT,
  EXPIRES_TOKEN_EMAIL_VERIFY,
  THIRTY_DAYS_IN_MILLISECONDS,
  EXPIRES_TOKEN_FOTGOT_PASSWORD,
  EXPIRES_TOKEN_VERIFY_OTP_FORGOT,
};
