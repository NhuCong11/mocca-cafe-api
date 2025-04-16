const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { messageMessage } = require('../messages');
const { Message, Conversation, User } = require('../models');
const { getReceiverSocketId, io } = require('../sockets/socket');

const sendMessage = async (chatBody) => {
  const { senderId, receiverId, message, image } = chatBody;

  let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
  if (!conversation) {
    conversation = await Conversation.create({ participants: [senderId, receiverId] });
  }

  const newMessage = await Message.create({ senderId, receiverId, message, image });
  if (newMessage) {
    conversation.message.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);
  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  return newMessage;
};

const getMessage = async (chatBody) => {
  const { senderId, receiverId } = chatBody;

  const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate(
    'message',
  );

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }

  return conversation.message;
};

const getListUsersChat = async (chatBody) => {
  const { userId } = chatBody;

  let listUserId = [];
  const conversations = await Conversation.find({ participants: { $all: [userId] } });

  for (const conversation of conversations) {
    listUserId.push(
      conversation.participants[0].toString() !== userId ? conversation.participants[0] : conversation.participants[1],
    );
  }

  const users = await User.find({ _id: { $in: listUserId } });
  return users;
};

module.exports = {
  sendMessage,
  getMessage,
  getListUsersChat,
};
