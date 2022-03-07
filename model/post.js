const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["TO DO", "INPROCESS", "DONE"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("posts", PostSchema);
