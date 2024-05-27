import mongoose, { mongo } from "mongoose";
const evaluateSubSchema = new mongoose.Schema({
  taskId: Number,
  title: String,
  link: String,
  conditions: String,
});
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      // require: true
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      // require: true,
    },
    topUpBalance: {
      type: Number,
      default: 0,
      require: true,
    },
    mainBalance: {
      type: Number,
      default: 0,
      require: true,
    },

    // publishedTask: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostTask" }],

    taskTaken: {
      type: Array,
    },
    evaluate: {
      //this will have the all the taken tasks with there status, title, necessary conditions etc.
      //this is an array of objects
      type: [mongoose.Schema.Types.Mixed],
      default: Date.now,
    },
    //task status in user profile
    inProgressTask: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    underEvaluation: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    completedTask: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
