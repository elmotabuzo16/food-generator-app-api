import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamp: true }
);
const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
