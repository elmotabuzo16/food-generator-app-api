import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev')); // will give us endpoints in console

// middleware for routes
app.use('/api/recipe', foodRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
console.log(__dirname);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(
    express.static(path.join(__dirname, '/frontend-nextjs/.next/server'))
  );

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, 'frontend-nextjs', '.next/server', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// error middleware outside the routes
app.use(notFound);

// error mdidleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} port ${PORT}`.blue.bold
  )
);