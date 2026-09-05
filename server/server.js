import express from 'express';
import cors from 'cors';
import connectDB from './config/db.config.js';

import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import seriesRoutes from './routes/series.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/movie', moviesRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'FilmPeek' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Page not found!' });
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT || PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });
