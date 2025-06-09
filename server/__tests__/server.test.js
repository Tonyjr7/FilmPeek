import { jest } from '@jest/globals';
import request from 'axios';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.js';
import moviesRoutes from '../routes/movies.js';
import fetchData from '../services/api.js';
import User from '../models/user.js';
import { hashedPassword, matchPassword } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import connectDB from '../config/db.config.js';

// Mocking before imports (ESM style with hoisting safety)
jest.unstable_mockModule('dotenv', () => ({
  config: jest.fn(),
}));

jest.unstable_mockModule('../services/api.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.unstable_mockModule('../models/user.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../services/auth.js', () => ({
  __esModule: true,
  hashedPassword: jest.fn(),
  matchPassword: jest.fn(),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule('../config/db.config.js', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

// Wait for all ESM mocks to load
await import('dotenv/config');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movie', moviesRoutes);

let server;

beforeAll(async () => {
  server = app.listen(PORT);
});

afterAll(async () => {
  await server.close();
});

describe('Movie API Endpoints', () => {
  const DUMMY_TOKEN = 'mock-jwt-token';
  const DUMMY_USER_ID = 'testUserId123';

  beforeEach(() => {
    fetchData.mockReset();
    User.findOne.mockReset();
    User.findById.mockReset();
    User.create.mockReset();
    hashedPassword.mockReset();
    matchPassword.mockReset();
    jwt.default.sign.mockReset();
    jwt.default.verify.mockReset();

    jwt.default.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: DUMMY_USER_ID });
    });
  });

  describe('GET /api/movie/popular-movies', () => {
    it('should return top 10 popular movies', async () => {
      const mockMovies = Array.from({ length: 11 }).map((_, i) => ({
        id: i + 1,
        title: `Movie ${i + 1}`,
        poster_path: `/path${i + 1}.jpg`,
        overview: `Overview ${i + 1}`,
        backdrop_path: `/backdrop${i + 1}.jpg`,
      }));

      fetchData.mockResolvedValueOnce({ results: mockMovies });

      const response = await request.get(`http://localhost:${PORT}/api/movie/popular-movies`);
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(10);
    });

    it('should handle API error gracefully', async () => {
      fetchData.mockRejectedValueOnce(new Error('API error'));

      const response = await request
        .get(`http://localhost:${PORT}/api/movie/popular-movies`)
        .catch((err) => err.response);

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'An error occured');
    });
  });

  describe('GET /api/movie/search', () => {
    it('should search movies by name', async () => {
      const mockSearchResults = [
        {
          id: 101,
          title: 'Searched Movie 1',
          poster_path: '/search1.jpg',
          overview: 'Overview Search 1',
          backdrop_path: '/backdropSearch1.jpg',
        },
      ];
      fetchData.mockResolvedValueOnce({
        results: mockSearchResults,
      });

      const response = await request.get(`http://localhost:${PORT}/api/movie/search?name=test`);
      expect(response.status).toBe(200);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0].title).toBe('Searched Movie 1');
      expect(fetchData).toHaveBeenCalledWith('search/movie?query=test');
    });

    it('should return 400 if no search parameters are provided', async () => {
      const response = await request
        .get(`http://localhost:${PORT}/api/movie/search`)
        .catch((err) => err.response);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Please provide a movie name or year');
    });
  });

  // --- Authenticated Movie Endpoints ---

  describe('POST /api/movie/user/favorites/add', () => {
    it('should add a movie to favorites for an authenticated user', async () => {
      const mockUser = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValueOnce(mockUser);

      const response = await request.post(
        `http://localhost:${PORT}/api/movie/user/favorites/add`,
        {
          movieId: 123,
        },
        {
          headers: {
            Authorization: `Bearer ${DUMMY_TOKEN}`,
          },
        }
      );
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'Movie added to favorite');
      expect(mockUser.favoriteMovies).toContain(123);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 400 if movie is already in favorites', async () => {
      const mockUser = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [123],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValueOnce(mockUser);

      const response = await request
        .post(
          `http://localhost:${PORT}/api/movie/user/favorites/add`,
          {
            movieId: 123,
          },
          {
            headers: {
              Authorization: `Bearer ${DUMMY_TOKEN}`,
            },
          }
        )
        .catch((err) => err.response);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Movie already in your favorites');
      expect(mockUser.save).not.toHaveBeenCalled();
    });

    it('should return 401 if not authenticated', async () => {
      jwt.default.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Invalid token'));
      }); // Simulate invalid token

      const response = await request
        .post(
          `http://localhost:${PORT}/api/movie/user/favorites/add`,
          {
            movieId: 123,
          },
          {
            headers: {
              Authorization: 'Bearer invalid-token',
            },
          }
        )
        .catch((err) => err.response);
      expect(response.status).toBe(403); // 403 for invalid token as per verifyToken
      expect(response.data).toHaveProperty('message', 'Invalid token.');
    });
  });

  describe('GET /api/movie/user/favorites', () => {
    it('should fetch favorite movies for an authenticated user', async () => {
      const mockUser = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [1, 2, 3],
      };
      User.findById.mockResolvedValueOnce(mockUser);

      const response = await request.get(`http://localhost:${PORT}/api/movie/user/favorites`, {
        headers: {
          Authorization: `Bearer ${DUMMY_TOKEN}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message', 'Favorite movie fetched');
      expect(response.data.data).toEqual([1, 2, 3]);
    });

    it('should return empty array if user has no favorites', async () => {
      const mockUser = {
        _id: DUMMY_USER_ID,
        favoriteMovies: [],
      };
      User.findById.mockResolvedValueOnce(mockUser);

      const response = await request.get(`http://localhost:${PORT}/api/movie/user/favorites`, {
        headers: {
          Authorization: `Bearer ${DUMMY_TOKEN}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data', []);
    });

    it('should return 401 if not authenticated', async () => {
      jwt.default.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Invalid token'));
      });

      const response = await request
        .get(`http://localhost:${PORT}/api/movie/user/favorites`, {
          headers: {
            Authorization: 'Bearer invalid-token',
          },
        })
        .catch((err) => err.response);
      expect(response.status).toBe(403);
      expect(response.data).toHaveProperty('message', 'Invalid token.');
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should successfully register a new user', async () => {
      User.findOne.mockResolvedValueOnce(null); // No existing user
      hashedPassword.mockResolvedValueOnce('hashedpassword123'); // Mock hashed password
      User.default.create.mockImplementationOnce((userData) => ({
        ...userData,
        toObject: () => ({
          ...userData,
          _id: 'newUserId',
          password: 'hashedpassword123',
          __v: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      }));

      const response = await request.post(`http://localhost:${PORT}/api/auth/signup`, {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'User created successfully');
      expect(response.data.user).not.toHaveProperty('password');
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(hashedPassword).toHaveBeenCalledWith('password123');
    });

    it('should return 400 if user with email already exists', async () => {
      User.findOne.mockResolvedValueOnce({
        email: 'test@example.com',
      }); // User already exists

      const response = await request
        .post(`http://localhost:${PORT}/api/auth/signup`, {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .catch((err) => err.response);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'User with this email already existed');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should successfully log in a user', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedpassword123',
      };
      User.findOne.mockResolvedValueOnce(mockUser);
      matchPassword.mockResolvedValueOnce(true); // Password matches
      jwt.default.sign.mockReturnValueOnce(DUMMY_TOKEN); // Return a dummy token

      const response = await request.post(`http://localhost:${PORT}/api/auth/signin`, {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message', 'Login successful');
      expect(response.data).toHaveProperty('token', DUMMY_TOKEN);
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(matchPassword).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(jwt.default.sign).toHaveBeenCalledWith(
        {
          id: 'userId123',
        },
        expect.any(String),
        {
          expiresIn: '1d',
        }
      );
    });

    it('should return 400 for invalid credentials (user not found)', async () => {
      User.findOne.mockResolvedValueOnce(null); // User not found

      const response = await request
        .post(`http://localhost:${PORT}/api/auth/signin`, {
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .catch((err) => err.response);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Invalid Credentials');
    });

    it('should return 400 for invalid credentials (wrong password)', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedpassword123',
      };
      User.findOne.mockResolvedValueOnce(mockUser);
      matchPassword.mockResolvedValueOnce(false); // Password does not match

      const response = await request
        .post(`http://localhost:${PORT}/api/auth/signin`, {
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .catch((err) => err.response);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('message', 'Wrong Password');
    });
  });
});
