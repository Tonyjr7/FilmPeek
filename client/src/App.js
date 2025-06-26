import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import FavoritesPage from './pages/FavoritesPage';
import WatchListPage from './pages/WatchlistPage';
import WatchlistDetailsPage from './pages/WatchListDetailPage';
import Profile from './pages/ProfilePage';
import WatchMovie from './pages/watchMovie';

function App() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch/');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/watchlist" element={<WatchListPage />} />
          <Route path="/watchlist/:id" element={<WatchlistDetailsPage />} />
          <Route path="/watch/:id" element={<WatchMovie />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      {!isWatchPage && <Footer />}
    </div>
  );
}

export default App;
