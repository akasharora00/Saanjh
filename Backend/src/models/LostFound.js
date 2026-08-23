import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "ID Card",
        "Wallet",
        "Keys",
        "Laptop",
        "Phone",
        "Earbuds",
        "Watch",
        "Books",
        "Notebook",
        "Calculator",
        "Water Bottle",
        "Clothes",
        "Others",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3 images"],
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    phone: {
      type: String,
      default: "",
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 3;
}

const LostFound = mongoose.model("LostFound", lostFoundSchema);

export default LostFound;
