import mongoose from "mongoose";

const plantsSchama = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  collection: {
    type: String,
    required: true,
  },
  subCollection: {
    type: String,
    // required: true,
  },
  subCollection2: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Plants", plantsSchama);
