import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import generatorRoutes from './routes/generatorRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev'));

// middleware for routes
app.use('/api/recipe', recipeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/form', formRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ingredient', ingredientRoutes);
app.use('/api/generator', generatorRoutes);

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
