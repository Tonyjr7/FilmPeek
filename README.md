# FilmPeek

FilmPeek is a full-stack movie application that allows users to discover trending, popular, and top-rated movies, search for specific titles, manage a list of favorite movies, and create custom watchlists. Users can sign up, log in, and receive movie recommendations based on their favorite selections.

## Features

* **Browse Movies:** Explore a curated selection of popular, trending, and top-rated movies.
* **Search Functionality:** Easily find movies by title or release year.
* **User Authentication:** Secure sign-up and sign-in functionality.
* **Favorites:** Add movies to your personal favorites list.
* **Watchlists:** Create and manage multiple custom watchlists to organize movies.
* **Personalized Recommendations:** Get movie suggestions based on your favorited movies (authenticated users only).
* **Responsive Design:** Enjoy a seamless experience across various devices.

## Technologies Used

**Frontend (Client):**
* **React:** A JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing in the application.
* **Axios:** Promise-based HTTP client for making API requests.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Heroicons:** A set of free MIT-licensed high-quality SVG icons.
* **Jest & React Testing Library:** For testing React components.

**Backend (Server):**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database used for storing user data, favorites, and watchlists.
* **Mongoose:** MongoDB object modeling for Node.js.
* **bcryptjs:** For password hashing and security.
* **jsonwebtoken (JWT):** For secure user authentication.
* **Axios:** For making requests to the TMDB API.
* **Node-Cache:** For caching API responses to improve performance.
* **Nodemailer:** For sending emails (though its usage isn't fully detailed in provided files).
* **Jest:** For backend unit testing.

**External API:**
* **The Movie Database (TMDB) API:** Used to fetch movie data, including popular, trending, top-rated, and search results.

## Installation and Setup

To get FilmPeek up and running on your local machine, follow these steps:

### Prerequisites

* Node.js (>=14.0.0 for client, >=16.20.1 for server)
* npm or Yarn

### Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the `server` directory and add the following environment variables:
    ```
    URI_STRING=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    TMDB_API_KEY=your_tmdb_api_key
    TMDB_BASE_URL=[https://api.themoviedb.org/3/](https://api.themoviedb.org/3/)
    # Optional: For email functionality (if configured)
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```
    * Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., from MongoDB Atlas).
    * Replace `your_jwt_secret_key` with a strong, random string for JWT signing.
    * Obtain `your_tmdb_api_key` from [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api).
    * The `TMDB_BASE_URL` is typically `https://api.themoviedb.org/3/`.
4.  Start the backend server:
    ```bash
    npm start
    # or
    yarn start
    ```
    The server should start on `http://127.0.0.1:5000`.

### Frontend Setup

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the React development server:
    ```bash
    npm start
    # or
    yarn start
    ```
    The client application should open in your browser at `http://localhost:3000`.

## Usage

Once both the backend and frontend servers are running:

1.  **Browse:** Explore trending, popular, and top-rated movies directly from the homepage.
2.  **Sign Up/Log In:** Create an account or log in to access personalized features.
3.  **Search:** Use the search bar in the header to find movies by name.
4.  **Add to Favorites:** Click the star icon on movie details to add them to your favorites.
5.  **Manage Watchlists:**
    * Create new watchlists.
    * Add movies to existing watchlists from the movie details modal.
    * View details of each watchlist and delete watchlists from the "Watchlist" page.
6.  **Recommendations:** Authenticated users will see movie recommendations based on their favorited movies on the homepage.

## Running Tests

To run the backend tests:
```bash
cd server
npm test
# or
yarn test
````

To run the frontend tests:

```bash
cd client
npm test
# or
yarn test
```

## Contributing

Currently, there are no specific contributing guidelines. If you wish to contribute, please fork the repository and submit a pull request with your changes.

## License

MIT LICENCE

## Credits

  * Built with [React](https://react.dev/), [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/).
  * Movie data provided by [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api).