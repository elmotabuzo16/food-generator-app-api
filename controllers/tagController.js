import asyncHandler from 'express-async-handler';
import Tag from '../models/tagModel.js';
import slugify from 'slugify';

export const getTags = asyncHandler(async (req, res) => {
  const tags = await Category.find({});

  res.json(tags);
});

export const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const tag = new Tag({
    name: name,
    slug: slugify(name).toLowerCase(),
  });

  const createdTag = await tag.save();
  res.status(201).json(createdTag);
});
