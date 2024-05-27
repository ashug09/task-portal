import mongoose from "mongoose";
const submitDetailsSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      // require: true
    },
    promoterEmail: {
      type: String,
      // require: true
    },
    userId: {
      type: Number,
      // require: true
    },
    userEmail: {
      type: String,
      // require: true
    },
    answer: {
      type: String,
      // require: true
    },
    upload: {
      type: [String],
      // require: true
    },
    status:{
      type: String,
      default: "Pending Evaluation"
    }
  },
  { timestamps: true }
);
const SubmitDetails = mongoose.model("SubmitDetails", submitDetailsSchema);
export default SubmitDetails;
