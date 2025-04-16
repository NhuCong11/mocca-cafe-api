const base64url = require('base64url');

const { User, Order } = require('../models');
const { getReceiverSocketId, io } = require('../sockets/socket');

const sendSocketPayment = async (data) => {
  const { desc, amount, method } = data;
  try {
    if (method === 'recharge') {
      const user = await User.findOne({
        username: desc,
      });
      if (user) {
        const receiverSocketId = getReceiverSocketId(user._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('rechargeSuccess', {
            userId: user._id,
            amount,
            email: user.email,
          });
        }
      }
    } else if (method === 'payment') {
      const listOrderCode = base64url.decode(desc).split('|');

      let userInfo;
      for (const code of listOrderCode) {
        const order = await Order.findOne({ paymentCode: code }).populate('user');
        if (order) {
          console.log(order);
          userInfo = order.user;
          order.paymentStatus = 'paid';
          await order.save();
        }
      }
      if (userInfo) {
        const receiverSocketId = getReceiverSocketId(userInfo._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('paymentSuccess', {
            userId: userInfo._id,
            amount,
            email: userInfo.email,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendSocketPayment,
};
