const { env } = require('../config');

const tokenMappings = {
  access: {
    secret: env.jwt.secretAccess,
    expiresIn: env.jwt.expiresAccessToken,
  },
  refresh: {
    secret: env.jwt.secretRefresh,
    expiresIn: env.jwt.expiresRefreshToken,
  },
  twoFA: {
    secret: env.jwt.secret2FA,
    expiresIn: env.jwt.expires2FAToken,
  },
  verify: {
    secret: env.jwt.secretVerify,
    expiresIn: env.jwt.expiresVerify,
  },
};

module.exports = tokenMappings;
