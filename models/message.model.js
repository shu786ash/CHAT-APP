const { mongoose, Schema } = require("mongoose");
const messageSchema = Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  message: {
    type: String,
    require: true
  },
  isFile: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports=Message;