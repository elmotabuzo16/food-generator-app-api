import asyncHandler from 'express-async-handler';
import Food from '../models/foodModel.js';

export const getIngredients = asyncHandler(async (req, res) => {
  const ingredients = await Food.distinct('ingredients.name');

  res.json(ingredients);
});
