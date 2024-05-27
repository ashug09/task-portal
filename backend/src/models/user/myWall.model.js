import mongoose from "mongoose";
const myWallSchema = new mongoose.Schema({
  rating: {
    default: 1,
    type: Number,
    // require: true,
  },
  referels: {
    default: 0,
    type: [String],
    // require: true,
  },
  curator: {
    default: 0,
    type: [String],
    // require: true,
  },
  dateOfJoining: {
    type: Date,
    // require: true,
  },
  financialStats: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  }
});
const MyWall = mongoose.model("myWall", myWallSchema);
export default MyWall;
//my wall contains all the details of user related to finance, rating, referels, date of joining.