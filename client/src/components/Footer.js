const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <img src="/filmpeek.png" alt="FilmPeek Logo" className="h-10 mb-4" />
          <p className="text-sm">
            Discover and track your favorite movies. Stay updated with the
            latest trends and never miss out.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-white transition">
                Profile
              </a>
            </li>
            <li>
              <a href="/search" className="hover:text-white transition">
                Search
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Follow ME</h3>
          <div className="flex space-x-4 text-lg">
            <a
              href="https://www.linkedin.com/in/anthonytriumph/"
              target="blank"
              className="hover:text-white transition"
            >
              Linkedin
            </a>
            <a
              href="https://x.com/anthony_triumph"
              target="blank"
              className="hover:text-white transition"
            >
              Twitter
            </a>
            <a
              href="https://github.com/Tonyjr7"
              target="blank"
              className="hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} FilmPeek. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
