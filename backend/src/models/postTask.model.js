import mongoose from "mongoose";
const postTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      unique: true,
      // require: true,
    },
    title: {
      type: String,
      // required: true,
    },
    link: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    conditions: {
      type: String,
      // required: true,
    },
    selectedCategory: {
      type: String,
      // required: true,
    },
    amount: {
      type: Number,
      // required: true,
    },
    numberOfTasks: {
      type: Number,
      // required: true,
    },
    repeat: {
      type: String,
      // required: true,
    },
    maxTimeSpan: {
      type: Object,
      // required: true,
    },
    uniqueIP: {
      type: Boolean,
    },
    advertise: {
      type: Object,
    },
    rating: {
      type: Object, //for a particular rated users, like users having rating above 4 stars
    },
    selectedImplementers: {
      type: Object, //only for referrals
    },
    geotargeting: {
      type: Object,
    },
    finalCost: {
      type: Number,
      // required: true,
    },
    upload: {
      type: [String],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    email: {
      type: String,
      // unique: true,
      // require: true,
    },
  },
  { timestamps: true }
);
const PostTask = mongoose.model("PostTask", postTaskSchema);
export default PostTask;
