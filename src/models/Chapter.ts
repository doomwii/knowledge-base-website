import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },  // 公网视频链接
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
