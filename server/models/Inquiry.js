import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Links inquiry to a specific user
  email: String,
  phone: String,
  country: String,
  category: String,
  productName: String,
  productDetails: String,
  description: String
}, { timestamps: true });

export default mongoose.model('Inquiry', InquirySchema);