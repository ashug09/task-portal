import mongoose from "mongoose";
const financialStatsSchema = new mongoose.Schema({
  totalEarned: {
    type: Number,
    require: true,
  },
  earnFromLev1Referel: {
    type: Number,
    require: true,
  },
  earnFromLev2Referel: {
    type: Number,
    require: true,
  },
  earnFromReferelAd: {
    type: Number,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  email:{
    type: String,
    unique: true,
    require: true,
  }
});
const FinancialStats = mongoose.model("financialStats", financialStatsSchema);
export default FinancialStats;
