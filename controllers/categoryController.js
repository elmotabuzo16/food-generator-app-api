import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import Category from '../models/categoryModel.js';
import Blog from '../models/blogModel.js';

export const getCategory = asyncHandler(async (req, res) => {
  const tags = await Category.find({});

  res.json(tags);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = new Category({
    name: name,
    slug: slugify(name).toLowerCase(),
  });

  const createdCategory = await category.save();

  if (!createdCategory) {
    return res.status(404).json({
      error: 'Something went wrong creating a category.',
    });
  }

  res.status(201).json(createdCategory);
});

export const readTagWithBlog = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const category = await Category.findOne({ slug });

  if (!category) {
    return res.status(404).json({
      error: 'Category not found',
    });
  }

  const blog = Blog.find({ categories: category }).populate(
    'category',
    '_id name slug'
  );

  if (!blog) {
    return res.status(404).json({
      error: 'Something wrong.',
    });
  }

  res.json(blog);
});

export const getRelatedCategories = asyncHandler(async (req, res) => {
  // const { tag } = req.body;
  const { slug } = req.params;

  const category = await Category.findOne({ slug });
  const categoryId = category._id;

  // const recipes = await Food.find({ tags: { $in: tagId } }).select(
  //   '_id type name totalTime main_image calories carbs protein fat tags'
  // );
  const recipes = await Blog.find({ categories: { $in: categoryId } });

  res.status(200).json({ tagDescription: tag.description, foods: recipes });
});
