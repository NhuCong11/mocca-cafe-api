const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { contactService } = require('../services');
const { contactMessage } = require('../messages');

const createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, contactMessage().SEND_SUCCESS, contact));
});

const getContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.getContactsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, contactMessage().FIND_LIST_SUCCESS, contacts));
});

const getContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactService.getContactById(contactId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, contactMessage().FIND_SUCCESS, contact));
});

const deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactService.deleteContactById(contactId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, contactMessage().DELETE_SUCCESS, contact));
});

const exportExcel = catchAsync(async (req, res) => {
  const wb = await contactService.exportExcel(req.query);

  wb.writeToBuffer().then((buffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `contacts-moccacafe-${Date.now()}.xlsx`);
    res.send(buffer);
  });
});

module.exports = {
  getContact,
  getContacts,
  exportExcel,
  deleteContact,
  createContact,
};
