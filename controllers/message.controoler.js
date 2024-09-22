const Room = require("../models/room.model.js");
const Message = require("../models/message.model.js");
const { getReceiverSocketId, io } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
  const { message, isFile } = req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;

  if (!message) return res.status(404).json({ message: "message not found" });

  let room = await Room.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  if (!room) {
    room = await Room.create({
      participants: [senderId, receiverId],
    });
  }

  let newMessage = await Message.create({
    senderId,
    receiverId,
    message,
    isFile,
  });

  await newMessage.save();

  if (newMessage) {
    await room.messages.push(newMessage._id);
  }

  await room.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    console.log("sending to socket msg to", receiverSocketId, receiverId)
    console.log("sent by", getReceiverSocketId(senderId), senderId)
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
  return res.status(201).json({
    newMessage,
  });
};

const getMessage = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id;
  const room = await Room.findOne({
    participants: { $all: [senderId, id] },
  }).populate("messages");
  if (!room) return res.status(404).json({ message: "message not found" });
  return res.status(200).json(room);
};

module.exports = { sendMessage, getMessage };
