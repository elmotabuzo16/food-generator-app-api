import mongoose from 'mongoose';

const bodyDescriptionSchema = mongoose.Schema({
  description: { type: String, required: false },
});

const commentSchema = mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  content: { type: String, required: false },
  time: { type: Date, default: Date.now },
});

const bodySchema = mongoose.Schema({
  header: { type: String, required: false },
  bodyContent: { type: String, required: false },
  bodyDescription: [bodyDescriptionSchema],
  image: { type: String, required: false },
});

const tagSchema = mongoose.Schema({
  name: { type: String, required: false },
});

const blogSchema = mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    date_posted: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    body: [bodySchema],
    tags: [tagSchema],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blogs', blogSchema);

export default Blog;
