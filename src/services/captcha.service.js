const svgCaptcha = require('svg-captcha');

const { env } = require('../config');
const { EXPIRES_TOKEN_CAPTCHA } = require('../constants');
const { encryptObj, expiresCheck } = require('./crypto.service');

const generate = () => {
  const { text, data: image } = svgCaptcha.create();
  // const base64 = `data:image/svg+xml;base64,${Buffer.from(image).toString('base64')}`;
  const expires = Date.now() + EXPIRES_TOKEN_CAPTCHA;

  const sign = encryptObj(
    JSON.stringify({
      text,
      expires,
    }),
    env.secret.tokenCapcha,
  );

  // return { text, sign, image };
  return { sign, image };
};

const verify = (sign, text) => {
  const { isExpired, payload } = expiresCheck(sign, env.secret.tokenCapcha);

  if (text === JSON.parse(payload).text && !isExpired) {
    return true;
  }

  return false;
};

module.exports = { generate, verify };
