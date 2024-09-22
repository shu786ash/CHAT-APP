const { mongoose, Schema } = require("mongoose");

const roomShema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      default: []
    }
  ],

}, { timestamps: true });

const Room = mongoose.model("Room", roomShema);
module.exports = Room
