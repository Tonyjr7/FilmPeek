import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import FavoritesPage from './pages/FavoritesPage';
import WatchListPage from './pages/WatchlistPage';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/watchlist" element={<WatchListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
