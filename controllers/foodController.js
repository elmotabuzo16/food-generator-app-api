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
// @route   GET /api/recipe/:id
// @access  Public
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Food.find({ slug: req.params.slug });

  if (recipe[0]) {
    res.json(recipe[0]);
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

const createRecipeReview = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  const recipe = await Food.find({ slug: req.params.slug });

  const review = {
    name: name,
    rating: Number(rating),
    comment: comment,
  };

  try {
    recipe[0].reviews.push(review);

    recipe[0].numReviews = recipe[0].reviews.length;
    recipe[0].rating = recipe[0].reviews.reduce(
      (acc, item) => item.rating + acc,
      0 / recipe[0].reviews.length
    );

    console.log(recipe[0]);

    await recipe[0].save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// // @desc    Create new review
// // @route   POST /api/products/:id/reviews
// // @access  Public

export { getRecipes, createFood, getRecipeById, createRecipeReview };
