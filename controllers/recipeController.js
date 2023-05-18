import asyncHandler from 'express-async-handler';
import Food from '../models/foodModel.js';
import User from '../models/userModel.js';
import slugify from 'slugify';

// @desc    Fetch all recipe
// @route   GET /api/recipes
// @access  Public
export const getApprovedRecipes = asyncHandler(async (req, res) => {
  const recipes = await Food.find({ approved: true });

  res.json(recipes);
});

export const getNonApprovedRecipes = asyncHandler(async (req, res) => {
  const recipes = await Food.find({ approved: false });
  res.json(recipes);
});

// @desc    Fetch single recipe
// @route   GET /api/recipe/:slug
// @access  Public
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Food.findOne({ slug: req.params.slug });

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Create a recipe
// @route   POST /api/recipe
// @access  Protect
export const createFood = asyncHandler(async (req, res) => {
  const {
    category,
    type,
    name,
    main_image,
    calories,
    carbs,
    protein,
    fat,
    totalTime,
    servingCount,
    description,
    ingredients,
    servings,
    directions,
  } = req.body;

  const foodExists = await Food.findOne({ name });

  if (foodExists) {
    return res.status(400).json({
      error: 'Recipe already exists. Please re-enter the recipe name.',
    });
  }

  if (main_image) {
    console.log('existing');
  } else {
    console.log('not existing');
  }

  const food = new Food({
    user: req.user._id,
    category: category,
    type: type,
    name: name,
    main_image: main_image,
    calories: calories,
    carbs: carbs,
    protein: protein,
    fat: fat,
    slug: slugify(name).toLowerCase(),
    totalTime: totalTime,
    servingCount: servingCount,
    description: description,
    ingredients: ingredients,
    servings: servings,
    directions: directions,
  });

  console.log(food);

  try {
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// // @desc    Create new review
// // @route   POST /api/products/:slug/reviews
// // @access  Public
export const createRecipeReview = asyncHandler(async (req, res) => {
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

export const approvedRecipe = asyncHandler(async (req, res) => {
  const recipe = await Food.findOne({ slug: req.params.slug });

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  recipe.approved = true;
  await recipe.save();

  res.status(201).json({ message: 'Recipe approved' });
});

export const listByUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    return res
      .status(401)
      .json({ error: 'Username / email address does not exists.' });
  }

  if (user) {
    let userId = user._id;

    const food = await Food.find({ user: userId });

    res.status(201).json(food);
  }
});
