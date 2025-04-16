const path = require('path');
const { QRCodeCanvas } = require('@loskir/styled-qr-code-node');

const {
  LOGO_QRCODE_NAME,
  LOGO_SIZE,
  HOST_NAME,
  LOGO_BACKGROUND_COLOR,
  LOGO_DOTS_COLOR,
  LOGO_MARGIN,
  LOGO_IMAGE_MARGIN,
} = require('../constants');

const options = {
  width: LOGO_SIZE,
  height: LOGO_SIZE,
  margin: LOGO_MARGIN,
  image: path.join(__dirname, '../..', 'public', 'images', LOGO_QRCODE_NAME),
  dotsOptions: {
    color: LOGO_DOTS_COLOR,
    type: 'square',
  },
  backgroundOptions: {
    color: LOGO_BACKGROUND_COLOR,
  },
  imageOptions: {
    crossOrigin: HOST_NAME,
    margin: LOGO_IMAGE_MARGIN,
  },
};

const renderQRCode = async (url) => {
  const qrCode = new QRCodeCanvas({ ...options, data: url });

  const buffer = await qrCode.toBuffer('png');

  return buffer;
};

module.exports = renderQRCode;
