import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
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
const Category = mongoose.model('Category', categorySchema);

export default Category;
