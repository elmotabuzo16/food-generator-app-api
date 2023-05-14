import asyncHandler from 'express-async-handler';
import Food from '../models/foodModel.js';

// @desc    Fetch all recipe
// @route   GET /api/recipes
// @access  Public
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Food.find({});

  res.json(recipes);
});

// @desc    Fetch single recipe
// @route   GET /api/recipe/:slug
// @access  Public
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Food.findOne({ slug: req.params.slug });

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Create a recipe
// @route   PUT /api/recipe
// @access  Private/Admin
const createFood = asyncHandler(async (req, res) => {
  const {
    category,
    type,
    name,
    main_image,
    calories,
    slug,
    totalTime,
    servingCount,
    description,
    ingredients,
    servings,
    directions,
  } = req.body;

  const food = new Food({
    user: req.user._id,
    category: category,
    type: type,
    name: name,
    main_image: main_image,
    calories: calories,
    slug: slug,
    totalTime: totalTime,
    servingCount: servingCount,
    description: description,
    ingredients: ingredients,
    servings: servings,
    directions: directions,
  });

  const createdFood = await food.save();
  res.status(201).json(createdFood);
});

// // @desc    Create new review
// // @route   POST /api/products/:slug/reviews
// // @access  Public
const createRecipeReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const recipe = await Food.findOne({ slug: req.params.slug });

  if (recipe) {
    const alreadyReviewed = recipe.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
    user: req.user._id,
  };

  try {
    recipe.reviews.push(review);

    recipe.numReviews = recipe.reviews.length;

    recipe.rating =
      recipe.reviews.reduce((acc, item) => item.rating + acc, 0) /
      recipe.reviews.length;

    await recipe.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export { getRecipes, createFood, getRecipeById, createRecipeReview };
