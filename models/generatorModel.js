import mongoose from 'mongoose';

const generatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    generatorClicks: {
      type: Number,
      default: 0,
    },
    homePageViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamp: true }
);
const Generator = mongoose.model('Generator', generatorSchema);

export default Generator;
