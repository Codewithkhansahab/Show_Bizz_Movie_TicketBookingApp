import axios from "axios"
import axiosRetry from "axios-retry"
import Movie from "../models/Movie.js";
import Show from "../models/Shows.js";

// Configure robust axios retry logic globally
axiosRetry(axios, {
  retries: 5, // Increased number of retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Wait time between retries (exponential)
  retryCondition: (error) => {
    // Handle network errors, idempotent request errors, and ECONNRESET errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.code === 'ECONNRESET' || 
           error.code === 'ETIMEDOUT';
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt #${retryCount} for ${requestConfig.url} due to ${error.code || error.message}`);
  }
});



export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      headers: {
          accept: 'application/json', // optional but recommended
          Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`, // Bearer token here
      },
      timeout: 15000, // Increased timeout to 15 seconds
    });

    res.json({ success: true, movies: data.results });
  } catch (error) {
    console.error("Error fetching now playing movies:", error.code || error.message);

    // Send a more informative error response
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch movies from TMDB. Please try again later.",
      error: error.code || error.message
    });
  }
};



// The axios-retry configuration is already set up at the top of the file

export const addShow = async (req, res) => {
  try {
    let { movieId, showsInput, showPrice } = req.body;

    // ✅ Step 1: Convert IMDb ID to TMDB ID if needed
    if (typeof movieId === 'string' && movieId.startsWith('tt')) {
      const findResponse = await axios.get(
        `https://api.themoviedb.org/3/find/${movieId}?external_source=imdb_id`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`,
          },
          timeout: 15000, // Increased timeout to 15 seconds
        }
      );

      const tmdbId = findResponse.data.movie_results[0]?.id;

      if (!tmdbId) {
        return res.status(404).json({ success: false, message: "TMDB Movie not found for IMDb ID" });
      }

      movieId = tmdbId; // overwrite with TMDB ID
    }

    // ✅ Step 2: Check if movie already exists
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // ✅ Fetch movie details and credits from TMDB
      const [movieDetailResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`,
          },
          timeout: 15000, // Increased timeout to 15 seconds
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`,
          },
          timeout: 15000, // Increased timeout to 15 seconds
        }),
      ]);

      const movieApiData = movieDetailResponse.data;
      const movieCreditsApiData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        poster_path: movieApiData.poster_path,
        overview: movieApiData.overview,
        release_date: movieApiData.release_date,
        runtime: movieApiData.runtime,
        genres: movieApiData.genres,
        cast: movieCreditsApiData.cast,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        backdrop_path: movieApiData.backdrop_path,
        original_language: movieApiData.original_language,
      };

      // ✅ Save movie to DB
      movie = await Movie.create(movieDetails);
    }

    // ✅ Prepare show documents
    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    // ✅ Save shows
    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({
      success: true,
      message: "Movie and shows created successfully",
    });
  } catch (error) {
    console.error("❌ Error in addShow:", error.code || error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add show. Please try again later.",
      error: error.code || error.message
    });
  }
};


export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({showDateTime: {$gte: new Date()}})
      .populate('movie')
      .sort({showDateTime: 1});

    // Use a Map to track unique movies by their _id
    const uniqueMoviesMap = new Map();

    shows.forEach(show => {
      if (show.movie && !uniqueMoviesMap.has(show.movie._id.toString())) {
        uniqueMoviesMap.set(show.movie._id.toString(), show.movie);
      }
    });

    // Convert the Map values to an array
    const uniqueMovies = Array.from(uniqueMoviesMap.values());

    res.json({success: true, shows: uniqueMovies});
  }
  catch(error) {
    console.error("Error fetching shows:", error.code || error.message);
    res.status(500).json({
      success: false, 
      message: "Failed to fetch shows. Please try again later.",
      error: error.code || error.message
    });
  }

}


export const getShow = async (req,res)=>{
  try{
  const {movieId} = req.params;
  // get all show upcoming
  const shows = await Show.find({movie : movieId,showDateTime :{$gte : new Date()}})

  const movie = await Movie.findById(movieId);
  const dateTime = {};
  shows.forEach((show) => {
    const date = show.showDateTime.toISOString().split("T")[0];
    if (!dateTime[date]){
      dateTime[date] = [];
      dateTime[date].push({time:show.showDateTime,showId:show._id})
    }
    })
    res.json({success : true,movie,dateTime})
  }
  catch(error){
    console.error("Error fetching show details:", error.code || error.message);
    res.status(500).json({
      success: false, 
      message: "Failed to fetch show details. Please try again later.",
      error: error.code || error.message
    });
  }

}
