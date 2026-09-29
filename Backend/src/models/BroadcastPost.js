import mongoose from "mongoose";

const broadcastPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    category: { 
      type: String, 
      required: true, 
      enum: ["Academic Doubt", "Campus Query", "Study Material", "General Discussion", "Opportunity", "Other"] 
    },
    description: { type: String, required: true, maxlength: 2000 },
    attachment: { type: String, default: "" },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BroadcastPost = mongoose.model("BroadcastPost", broadcastPostSchema);

export default BroadcastPost;
