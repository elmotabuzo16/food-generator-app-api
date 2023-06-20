import asyncHandler from 'express-async-handler';
import Generator from '../models/generatorModel.js';

// POST
export const incrementGeneratorClicks = asyncHandler(async (req, res) => {
  const generator = await Generator.findOne({ name: 'Generator' });

  if (!generator) {
    return res.status(404).json({ message: 'Generator not found' });
  }

  generator.generatorClicks = generator.generatorClicks + 1;
  await generator.save();

  res.json(generator);
});

export const createGenerate = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const generator = new Generator({
    name: name,
  });

  const createdGenerator = await generator.save();

  if (!createdGenerator) {
    return res.status(404).json({
      error: 'Something went wrong creating a tag.',
    });
  }

  res.status(201).json(createdGenerator);
});
