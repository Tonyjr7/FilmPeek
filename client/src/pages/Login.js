import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { signIn } from '../utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null); // toast state {message, type}
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Please fill in both fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await signIn(email, password);
      const token = response.data.token;
      localStorage.setItem('token', token);

      setToast({ message: 'Login successful', type: 'success' });
      setTimeout(() => navigate('/'), 1500); // navigate after toast
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Login failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md transition ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-700">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-yellow-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Toast component rendered here */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
