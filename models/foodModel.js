import mongoose from 'mongoose';

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  image: { type: String, required: false },
});

const servingSchema = mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
});

const directionSchema = mongoose.Schema({
  description: { type: String, required: false },
  image: { type: String, required: false },
});

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const foodSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    calories: {
      type: Number,
      required: true,
      default: 0,
    },
    carbs: {
      type: String,
      required: true,
      default: 0,
    },
    protein: {
      type: String,
      required: true,
      default: 0,
    },
    fat: {
      type: String,
      required: true,
      default: 0,
    },
    main_image: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    totalTime: {
      type: String,
      required: false,
    },
    servingCount: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    approved: {
      type: Boolean,
      required: true,
      default: false,
    },
    ingredients: [ingredientSchema],
    servings: [servingSchema],
    directions: [directionSchema],
    reviews: [reviewSchema],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model('Foods', foodSchema);

export default Food;
