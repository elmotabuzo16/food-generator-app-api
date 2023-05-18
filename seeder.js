import dotenv from 'dotenv';
import colors from 'colors';

import DUMMY_FOOD from './data/DUMMY_FOOD.js';
import DUMMY_USERS from './data/DUMMY_USERS.js';
import DUMMY_BLOG from './data/DUMMY_BLOG.js';

import User from './models/userModel.js';
import Food from './models/foodModel.js';

import connectDB from './config/connectDB.js';
import Blog from './models/blogModel.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    // await Food.deleteMany();
    // await Blog.deleteMany();

    // insert users from User DB
    const createdUsers = await User.insertMany(DUMMY_USERS);
    console.log('User Imported!'.green.inverse);

    // get the admin user ID
    // const adminUser = createdUsers[0]._id;
    // console.log(`Admin user - ${adminUser}`);

    // const sampleFoods = DUMMY_FOOD.map((food) => {
    //   return { ...food, user: adminUser };
    // });

    // await Food.insertMany(sampleFoods);
    // console.log('Food Imported!'.green.inverse);

    // await Blog.insertMany(DUMMY_BLOG);
    // console.log('Blog Imported!'.green.inverse);

    process.exit();

    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData();
