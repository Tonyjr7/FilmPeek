import dotenv from 'dotenv';

dotenv.config();

const fetchData = async (url) => {
  const base_url = process.env.TMDB_BASE_URL;

  const API_KEY = process.env.TMDB_API_KEY;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  try {
    const res = await fetch(base_url + url, options);
    const json = await res.json();
    return json;
  } catch (err) {
    return err;
  }
};

export default fetchData;
