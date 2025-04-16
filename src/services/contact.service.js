const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');

const { Contact } = require('../models');
const ApiError = require('../utils/ApiError');
const { contactMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const { STYLE_EXPORT_EXCEL, PAGE_DEFAULT, LIMIT_DEFAULT_EXPORT } = require('../constants');

const getContactByEmail = async (email) => {
  const contact = await Contact.findOne({ email });
  return contact;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, contactMessage().NOT_FOUND);
  }

  return contact;
};

const createContact = async (contactBody) => {
  const contact = await Contact.create(contactBody);
  return contact;
};

const getContactsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Contact);

  const { results, ...detailResult } = await apiFeature.getResults(query, ['fullname', 'email', 'phone', 'message']);

  return { contacts: results, ...detailResult };
};

const deleteContactById = async (contactId) => {
  const contact = await getContactById(contactId);

  await contact.deleteOne();

  return contact;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Contact);

  query.page = PAGE_DEFAULT;
  query.limit = LIMIT_DEFAULT_EXPORT;

  const { results } = await apiFeature.getResults(query, ['fullname', 'email', 'phone']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Contacts');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(33);
  ws.column(5).setWidth(33);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('FullName').style(headerStyle);
  ws.cell(1, 3).string('Email').style(headerStyle);
  ws.cell(1, 4).string('Phone').style(headerStyle);
  ws.cell(1, 5).string('Message').style(headerStyle);
  ws.cell(1, 6).string('Last acctive').style(headerStyle);
  ws.cell(1, 7).string('Created At').style(headerStyle);

  results.forEach((contact, index) => {
    ws.cell(index + 2, 1).string(contact._id.toString());
    ws.cell(index + 2, 2).string(contact.fullname);
    ws.cell(index + 2, 3).string(contact.email);
    ws.cell(index + 2, 4).string(contact.phone);
    ws.cell(index + 2, 5).string(contact.message);
    ws.cell(index + 2, 6).string(moment(contact.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 7).string(moment(contact.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

module.exports = {
  exportExcel,
  createContact,
  getContactById,
  getContactByEmail,
  deleteContactById,
  getContactsByKeyword,
};
