import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock modules BEFORE importing the actual modules
const mockFetchData = jest.fn();
const mockUser = {
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};
const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn(),
};

// Mock the modules
jest.unstable_mockModule('../services/api.js', () => ({
  default: mockFetchData,
}));

jest.unstable_mockModule('../models/user.js', () => ({
  default: mockUser,
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: mockJwt,
}));

// Now import the routes after mocking
const authRoutes = await import('../routes/auth.js');
const moviesRoutes = await import('../routes/movies.js');

// Create express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes.default);
app.use('/api/movie', moviesRoutes.default);

const PORT = 5002;
let server;

beforeAll(async () => {
  server = app.listen(PORT);
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
});

describe('Movie API Extended Tests', () => {
  const DUMMY_TOKEN = 'mock-jwt-token';
  const DUMMY_USER_ID = 'testUserId123';

  beforeEach(() => {
    // Reset all mocks
    mockFetchData.mockReset();
    mockUser.findOne.mockReset();
    mockUser.findById.mockReset();
    mockUser.create.mockReset();
    mockJwt.sign.mockReset();
    mockJwt.verify.mockReset();

    // Default JWT verification
    mockJwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: DUMMY_USER_ID });
    });
  });

  // 1. GET /api/movie/trending - Test trending movies endpoint
  describe('GET /api/movie/trending', () => {
    it('should return trending movies successfully', async () => {
      const mockTrendingMovies = [
        {
          id: 1,
          title: 'Trending Movie 1',
          poster_path: '/trending1.jpg',
          overview: 'A trending movie overview',
          backdrop_path: '/backdrop1.jpg',
        },
        {
          id: 2,
          title: 'Trending Movie 2',
          poster_path: '/trending2.jpg',
          overview: 'Another trending movie',
          backdrop_path: '/backdrop2.jpg',
        },
      ];

      mockFetchData.mockResolvedValueOnce({ results: mockTrendingMovies });

      const response = await request(app).get('/api/movie/trending');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Trending Movie 1');
      expect(mockFetchData).toHaveBeenCalledWith('trending/movie/day?language=en-US');
    });

    it('should handle API error when fetching trending movies', async () => {
      mockFetchData.mockRejectedValueOnce(new Error('TMDB API Error'));

      const response = await request(app).get('/api/movie/trending');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'An error occured');
    });
  });

  // 2. GET /api/movie/:id - Test movie details endpoint
  describe('GET /api/movie/:id', () => {
    it('should return movie details successfully', async () => {
      const mockMovieDetails = {
        id: 123,
        title: 'Test Movie',
        tagline: 'An amazing movie',
        release_date: '2024-01-01',
        overview: 'This is a test movie overview',
        poster_path: '/test.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 8.5,
        genres: [
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
        ],
      };

      mockFetchData.mockResolvedValueOnce(mockMovieDetails);

      const response = await request(app).get('/api/movie/123');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(123);
      expect(response.body.title).toBe('Test Movie');
      expect(response.body.tagline).toBe('An amazing movie');
      expect(response.body.vote_average).toBe(8.5);
      expect(mockFetchData).toHaveBeenCalledWith('movie/123?language=en-US');
    });

    it('should handle error when movie is not found', async () => {
      mockFetchData.mockRejectedValueOnce(new Error('Movie not found'));

      const response = await request(app).get('/api/movie/999');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'An error occured');
    });
  });

  // 3. POST /api/movie/user/watchlist/create-watchlist - Test watchlist creation
  describe('POST /api/movie/user/watchlist/create-watchlist', () => {
    it('should create a new watchlist successfully', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        watchLists: [],
        save: jest.fn().mockResolvedValue(true),
      };

      mockUser.findById.mockResolvedValueOnce(mockUserInstance);

      const response = await request(app)
        .post('/api/movie/user/watchlist/create-watchlist')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({ watchlistName: 'My Action Movies' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Watchlist created');
      expect(response.body.watchlist.name).toBe('My Action Movies');
      expect(mockUserInstance.watchLists).toHaveLength(1);
      expect(mockUserInstance.save).toHaveBeenCalled();
    });

    it('should return 400 if watchlist name already exists', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        watchLists: [{ name: 'My Action Movies', movies: [] }],
        save: jest.fn(),
      };

      mockUser.findById.mockResolvedValueOnce(mockUserInstance);

      const response = await request(app)
        .post('/api/movie/user/watchlist/create-watchlist')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({ watchlistName: 'My Action Movies' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'You already have this watchlist');
      expect(mockUserInstance.save).not.toHaveBeenCalled();
    });

    it('should return 400 if watchlist name is missing', async () => {
      const response = await request(app)
        .post('/api/movie/user/watchlist/create-watchlist')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Please include a watchlist name');
    });

    it('should return 403 if user is not authenticated', async () => {
      mockJwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Invalid token'));
      });

      const response = await request(app)
        .post('/api/movie/user/watchlist/create-watchlist')
        .set('Authorization', 'Bearer invalid-token')
        .send({ watchlistName: 'My Action Movies' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid token.');
    });
  });

  // 4. GET /api/movie/user/recommendations - Test movie recommendations
  describe('GET /api/movie/user/recommendations', () => {
    it('should return movie recommendations based on user favorites', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [100, 200, 300],
      };

      const mockRecommendations = [
        {
          id: 401,
          title: 'Recommended Movie 1',
          poster_path: '/rec1.jpg',
          overview: 'A great recommendation',
          backdrop_path: '/rec_backdrop1.jpg',
        },
        {
          id: 402,
          title: 'Recommended Movie 2',
          poster_path: '/rec2.jpg',
          overview: 'Another recommendation',
          backdrop_path: '/rec_backdrop2.jpg',
        },
      ];

      mockUser.findById.mockResolvedValueOnce(mockUserInstance);
      mockFetchData.mockResolvedValueOnce({ results: mockRecommendations });

      const response = await request(app)
        .get('/api/movie/user/recommendations')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Recommended Movie 1');
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringMatching(/^movie\/\d+\/recommendations\?language=en-US$/)
      );
    });

    it('should return 404 if user is not found', async () => {
      mockUser.findById.mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/api/movie/user/recommendations')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should handle API error when fetching recommendations', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [100],
      };

      mockUser.findById.mockResolvedValueOnce(mockUserInstance);
      mockFetchData.mockRejectedValueOnce(new Error('TMDB API Error'));

      const response = await request(app)
        .get('/api/movie/user/recommendations')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'An error occured');
    });
  });

  // 5. POST /api/movie/user/favorites/remove - Test removing movie from favorites
  describe('POST /api/movie/user/favorites/remove', () => {
    it('should remove movie from favorites successfully', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [100, 200, 300],
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock the pull method
      mockUserInstance.favoriteMovies.pull = jest.fn();

      mockUser.findById.mockResolvedValueOnce(mockUserInstance);

      const response = await request(app)
        .post('/api/movie/user/favorites/remove')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({ movieId: 200 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Movie removed from favorite');
      expect(mockUserInstance.favoriteMovies.pull).toHaveBeenCalledWith(200);
      expect(mockUserInstance.save).toHaveBeenCalled();
    });

    it('should return 400 if movie is not in favorites', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [100, 300],
        save: jest.fn(),
      };

      mockUser.findById.mockResolvedValueOnce(mockUserInstance);

      const response = await request(app)
        .post('/api/movie/user/favorites/remove')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({ movieId: 200 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Movie not in favorites');
      expect(mockUserInstance.save).not.toHaveBeenCalled();
    });

    it('should return 400 if movieId is missing', async () => {
      const response = await request(app)
        .post('/api/movie/user/favorites/remove')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Please include a movie');
    });

    it('should return 403 if user is not authenticated', async () => {
      mockJwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Invalid token'));
      });

      const response = await request(app)
        .post('/api/movie/user/favorites/remove')
        .set('Authorization', 'Bearer invalid-token')
        .send({ movieId: 200 });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid token.');
    });

    it('should handle database errors gracefully', async () => {
      const mockUserInstance = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [100, 200, 300],
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockUserInstance.favoriteMovies.pull = jest.fn();
      mockUser.findById.mockResolvedValueOnce(mockUserInstance);

      const response = await request(app)
        .post('/api/movie/user/favorites/remove')
        .set('Authorization', `Bearer ${DUMMY_TOKEN}`)
        .send({ movieId: 200 });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'An error occurred');
    });
  });
});
