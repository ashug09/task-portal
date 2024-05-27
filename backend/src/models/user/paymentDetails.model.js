import mongoose from "mongoose";
const paymentDetailsSchema = new mongoose.Schema({
  accountType: {
    type: String,
    require: true,
  },
  accountNumber: {
    type: String,
  },
  bankName: {
    type: String,
  },

  cardNumber: {
    type: String,
  },
  validBy: {
    type: Date,
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
const PaymentDetails = mongoose.model("PaymentDetails", paymentDetailsSchema);
export default PaymentDetails;