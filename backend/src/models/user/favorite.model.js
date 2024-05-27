import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema({
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
  },
});
const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
