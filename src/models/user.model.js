const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const twoFactor = require('node-2fa');

const {
  USER_ROLE_ENUM,
  BIRTHDAY_DEFAULT,
  USER_GENDER_ENUM,
  USER_AVATAR_DEFAULT,
  USER_BACKGROUND_DEFAULT,
  CODE_VERIFY_2FA_SUCCESS,
  USER_FORGOT_STATUS_ENUM,
} = require('../constants');

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
    },
    accountBalance: {
      type: Number,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    normalizedEmail: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      default: BIRTHDAY_DEFAULT,
    },
    gender: {
      type: String,
      enum: USER_GENDER_ENUM,
      default: USER_GENDER_ENUM.MALE,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    verifyExpireAt: {
      type: Date,
    },
    forgotStatus: {
      type: String,
      enum: USER_FORGOT_STATUS_ENUM,
      default: null,
    },
    isLocked: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: USER_ROLE_ENUM,
      default: USER_ROLE_ENUM.USER,
    },
    avatar: {
      type: String,
      default: USER_AVATAR_DEFAULT,
    },
    background: {
      type: String,
      default: USER_BACKGROUND_DEFAULT,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    is2FA: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isEmailTaken = async function (normalizedEmail, excludeUserId) {
  const user = await this.findOne({ normalizedEmail, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  if (!user.secret) {
    const { secret } = twoFactor.generateSecret();
    user.secret = secret;
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.is2FAMatch = async function (code) {
  const user = this;
  const result = twoFactor.verifyToken(user.secret, code);
  if (!result) return false;
  return CODE_VERIFY_2FA_SUCCESS.includes(result.delta);
};

module.exports = mongoose.model('User', userSchema);
