import formidable from 'formidable';
import Blog from '../models/blogModel.js';
import { smartTrim } from '../utils/smartTrim.js';
import slugify from 'slugify';
import { stripHtml } from 'string-strip-html';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import striptags from 'striptags';

export const listBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find({})
    .populate('categories', '_id name slug')
    .populate('postedBy', '_id name username')
    .select('_id title slug excerpt categories  postedBy createdAt updatedAt');

  res.json(blog);
});

export const readSingleBLog = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const blog = await Blog.findOne({ slug })
    .populate('categories', '_id name slug')
    .populate('postedBy', '_id name username')
    .select(
      '_id title body slug excerpt mtitle mdesc categories  postedBy createdAt updatedAt'
    );

  res.json(blog);
});

// export const read = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Blog.findOne({ slug })
//     .populate('categories', '_id name slug')
//     .populate('tags', '_id name slug')
//     .populate('postedBy', '_id name username profile')
//     .select(
//       '_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt'
//     )
//     .exec((err, data) => {
//       if (err) {
//         res.json({
//           error: errorHandler(err),
//         });
//       }

//       res.json(data);
//     });
// };

export const createBlog = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Error occurred while processing the form data',
      });
    }

    const { title, body, categories } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: 'Title is required',
      });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({
        error: 'Content is too short.',
      });
    }

    const cleanBody = striptags(body);
    console.log(categories);
    const arrayOfCategories = categories && categories.split(',');

    console.log(fields);

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(cleanBody, 150, ' ', '...');
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | Keto Food Generator`;
    blog.mdesc = stripHtml(body.substring(0, 160));
    blog.postedBy = req.user._id;

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image size should be less than 1MB',
        });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    try {
      const blogCreated = await blog.save();

      if (arrayOfCategories) {
        const addBlogCategories = await Blog.findByIdAndUpdate(
          blogCreated._id,
          {
            $push: { categories: arrayOfCategories },
          },
          { new: true }
        );

        await addBlogCategories.save();
      }

      res.json(blog);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Error occurred while saving the blog post' });
    }
  });

  // form.parse(req, (err, fields, files) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: 'Image could not upload',
  //     });
  //   }

  //   const { title, body, categories } = fields;

  //   if (!title || !title.length) {
  //     return res.status(400).json({
  //       error: 'Title is required',
  //     });
  //   }

  //   if (!body || body.length < 200) {
  //     return res.status(400).json({
  //       error: 'Content is too short.',
  //     });
  //   }

  //   // if (!categories || categories.length == 0) {
  //   //   return res.status(400).json({
  //   //     error: 'At least one category is required',
  //   //   });
  //   // }

  //   let blog = new Blog();
  //   blog.title = title;
  //   blog.body = body;
  //   blog.excerpt = smartTrim(body, 320, ' ', '...');
  //   blog.slug = slugify(title).toLowerCase();
  //   blog.mtitle = `${title} | Keto Food Generator`;
  //   blog.mdesc = stripHtml(body.substring(0, 160));
  //   blog.postedBy = req.auth._id;

  //   // categories
  //   // let arrayOfCategories = categories && categories.split(',');

  //   if (files.phsetValuesoto) {
  //     if (files.photo.size > 10000000) {
  //       return res.status(400).json({
  //         error: 'Image should be less then 1mb in size',
  //       });
  //     }
  //     blog.photo.data = fs.readFileSync(files.photo.filepath);
  //     blog.photo.contentType = files.photo.type;
  //   }

  //   res.json({});

  //   // blog.save((err, result) => {
  //   //   if (err) {
  //   //     console.log(err.message);
  //   //     return res.status(400).json({
  //   //       error: errorHandler(err),
  //   //     });
  //   //   }

  //   //   Blog.findByIdAndUpdate(
  //   //     result._id,
  //   //     {
  //   //       $push: { categories: arrayOfCategories },
  //   //     },
  //   //     { new: true }
  //   //   ).exec((err, result) => {
  //   //     if (err) {
  //   //       return res.status(400).json({
  //   //         error: errorHandler(err),
  //   //       });
  //   //     } else {
  //   //       res.json(result);
  //   //     }
  //   //   });
  //   // });
  // });
};
