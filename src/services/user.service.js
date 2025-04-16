const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');

const { env } = require('../config');
const { User, Cart } = require('../models');
const ApiError = require('../utils/ApiError');
const { userMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const emailFormatter = require('../utils/emailFormatter');
const generateUniqueSlug = require('../utils/generateUniqueSlug');
const { STYLE_EXPORT_EXCEL, THIRTY_DAYS_IN_MILLISECONDS, PAGE_DEFAULT, LIMIT_DEFAULT_EXPORT } = require('../constants');

const getUserByEmail = async (email) => {
  const normalizedEmail = emailFormatter(email);

  const user = await User.findOne({ normalizedEmail }).select('+password');

  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, userMessage().NOT_FOUND);
  }

  return user;
};

const createUser = async (userBody) => {
  const normalizedEmail = emailFormatter(userBody.email);

  if (await User.isEmailTaken(normalizedEmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, userMessage().EXISTS_EMAIL);
  }

  const lastUser = await User.findOne({ role: 'user' }).sort({ createdAt: -1 });
  const noUser = lastUser ? +lastUser.username.split('moccacafe')[1] : 0;

  if (!userBody.role || userBody.role === 'user') {
    userBody['username'] = 'moccacafe' + (noUser + 1);
    userBody['accountBalance'] = 0;
  }

  if (userBody.role === 'shop') {
    userBody['slug'] = await generateUniqueSlug(userBody.fullname, User);
  }

  userBody['normalizedEmail'] = normalizedEmail;

  const user = await User.create(userBody);

  if (!userBody.role || userBody.role === 'user') {
    await Cart.create({ user: user._id });
  }

  user.password = undefined;

  return user;
};

const getUsersByKeyword = async (query) => {
  const apiFeature = new ApiFeature(User);

  const { results, ...detailResult } = await apiFeature.getResults(query, ['fullname', 'email', 'phone']);

  return { users: results, ...detailResult };
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, userMessage().EXISTS_EMAIL);
  }

  if (
    updateBody.fullname &&
    user.role === 'shop' &&
    updateBody.fullname?.toLowerCase() !== user.fullname.toLowerCase()
  ) {
    updateBody['slug'] = await generateUniqueSlug(updateBody.fullname, User);
  }

  Object.assign(user, updateBody);

  await user.save();
  user.password = undefined;

  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  await user.deleteOne();
  user.password = undefined;

  return user;
};

const lockUserById = async (userId) => {
  const user = await getUserById(userId);

  Object.assign(user, { isLocked: !user.isLocked });

  await user.save();
  user.password = undefined;

  return user;
};

const createAdmin = async () => {
  const { email, password, fullname } = env.admin;

  let admin = await User.findOne({ email });

  if (!admin) {
    await User.create({
      email,
      fullname,
      password,
      role: 'admin',
      isVerify: true,
      normalizedEmail: emailFormatter(email),
    });
  } else {
    admin.email = email;
    admin.role = 'admin';
    admin.isVerify = true;
    admin.fullname = fullname;
    admin.password = password;
    admin.forgotStatus = null;
    admin.normalizedEmail = emailFormatter(email);
    await admin.save();
  }
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(User);

  query.page = PAGE_DEFAULT;
  query.limit = LIMIT_DEFAULT_EXPORT;

  const { results } = await apiFeature.getResults(query, ['fullname', 'email', 'phone']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Users');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(10);
  ws.column(6).setWidth(10);
  ws.column(7).setWidth(10);
  ws.column(8).setWidth(10);
  ws.column(9).setWidth(15);
  ws.column(10).setWidth(25);
  ws.column(11).setWidth(25);
  ws.column(12).setWidth(25);
  ws.column(13).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Fullname').style(headerStyle);
  ws.cell(1, 3).string('Username').style(headerStyle);
  ws.cell(1, 4).string('avatar').style(headerStyle);
  ws.cell(1, 5).string('Email').style(headerStyle);
  ws.cell(1, 6).string('Phone').style(headerStyle);
  ws.cell(1, 7).string('Role').style(headerStyle);
  ws.cell(1, 8).string('Gender').style(headerStyle);
  ws.cell(1, 9).string('Locked').style(headerStyle);
  ws.cell(1, 10).string('Verify').style(headerStyle);
  ws.cell(1, 11).string('Date of birth').style(headerStyle);
  ws.cell(1, 12).string('Last acctive').style(headerStyle);
  ws.cell(1, 13).string('Created At').style(headerStyle);

  results.forEach((user, index) => {
    ws.cell(index + 2, 1).string(user._id.toString());
    ws.cell(index + 2, 2).string(user.fullname);
    ws.cell(index + 2, 3).string(user.username);
    ws.cell(index + 2, 4).string(user.avatar);
    ws.cell(index + 2, 5).string(user.email);
    ws.cell(index + 2, 6).string(user.phone?.toString() || '');
    ws.cell(index + 2, 7).string(user.role);
    ws.cell(index + 2, 8).string(user.gender);
    ws.cell(index + 2, 9).string(user.isLocked ? 'Yes' : 'No');
    ws.cell(index + 2, 10).string(user.isVerify ? 'Yes' : 'No');
    ws.cell(index + 2, 11).string(moment(user.dateOfBirth).format('DD/MM/YYYY'));
    ws.cell(index + 2, 12).string(moment(user.lastAcctive).format('HH:mm:ss - DD/MM/YYYY'));
    ws.cell(index + 2, 13).string(moment(user.createdAt).format('HH:mm:ss - DD/MM/YYYY'));
  });

  return wb;
};

const deleteMyAccount = async (userId) => {
  const user = await getUserById(userId);

  const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_IN_MILLISECONDS);
  const readyDelete = user.createdAt < thirtyDaysAgo;

  if (!readyDelete) {
    throw new ApiError(httpStatus.BAD_REQUEST, userMessage().DONT_DELETE_ACCOUNT);
  }

  await user.deleteOne();
};

module.exports = {
  createUser,
  getUserById,
  createAdmin,
  exportExcel,
  lockUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  deleteMyAccount,
  getUsersByKeyword,
};
