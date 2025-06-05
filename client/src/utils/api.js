export const getMovieDetails = async (id) => {
  try {
    const res = await fetch(`http://192.168.0.129:5000/api/movie/${id}`);
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
