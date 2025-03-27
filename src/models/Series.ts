import mongoose from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Series || mongoose.model('Series', SeriesSchema);
