import mongoose from "mongoose";
const hiddenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  }
});
const Hidden = mongoose.model("Hidden", hiddenSchema);
export default Hidden;
//here comes the tasks that user had made hidden and these tasks will not appear on there home screen