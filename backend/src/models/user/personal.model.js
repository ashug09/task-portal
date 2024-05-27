import mongoose from "mongoose";
const personalSchema = new mongoose.Schema({
  gender: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: "",
  },
  maritalStatus: {
    type: String,
    default: "",
  },
  occupation: {
    type: String,
    default: "",
  },
  children: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
const Personal = mongoose.model("personal", personalSchema);
export default Personal;
