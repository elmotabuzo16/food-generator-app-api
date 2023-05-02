import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log('DB connected'.blue.bold))
    .catch((err) => console.log('DB Error => '.red.bold));
};

export default connectDB;
