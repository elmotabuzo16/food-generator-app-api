import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add other properties for your favorite schema
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
