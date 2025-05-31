import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    favoriteMovies: {
      type: [Number], // Just an array of TMDB IDs
      default: [],
    },

    watchLists: [
      {
        name: {
          type: String,
          required: true,
        },
        movies: {
          type: [Number], // TMDB movie IDs
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
