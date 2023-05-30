import asyncHandler from 'express-async-handler';
import Tag from '../models/tagModel.js';
import slugify from 'slugify';
import Food from '../models/foodModel.js';

export const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({});

  res.json(tags);
});

export const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const tag = new Tag({
    name: name,
    slug: slugify(name).toLowerCase(),
  });

  const createdTag = await tag.save();

  if (!createdTag) {
    return res.status(404).json({
      error: 'Something went wrong creating a tag.',
    });
  }

  res.status(201).json(createdTag);
});

export const readTagWithBlog = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const tag = await Tag.findOne({ slug });

  if (!tag) {
    return res.status(404).json({
      error: 'Tag not found',
    });
  }

  const blog = Blog.find({ tags: tag }).populate('tags', '_id name slug');

  if (!blog) {
    return res.status(404).json({
      error: 'Something wrong.',
    });
  }

  res.json(blog);
});

export const getRelatedTags = asyncHandler(async (req, res) => {
  // const { tag } = req.body;
  const { slug } = req.params;

  const tag = await Tag.findOne({ slug });
  const tagId = tag._id;

  // const recipes = await Food.find({ tags: { $in: tagId } }).select(
  //   '_id type name totalTime main_image calories carbs protein fat tags'
  // );
  const recipes = await Food.find({ tags: { $in: tagId } });

  res.status(200).json({ tagDescription: tag.description, foods: recipes });
});
