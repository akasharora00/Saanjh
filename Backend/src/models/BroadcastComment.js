import mongoose from "mongoose";

const broadcastCommentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "BroadcastPost", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "BroadcastComment", default: null },
    content: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const BroadcastComment = mongoose.model("BroadcastComment", broadcastCommentSchema);

export default BroadcastComment;
