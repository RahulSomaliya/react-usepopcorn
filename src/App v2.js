import { useEffect, useState } from 'react';
import NavBar from './Components/NavBar';
import Search from './Components/Search';
import NumResults from './Components/NumResults';
import Main from './Components/Main';
import Box from './Components/Box';
import Loader from './Components/Loader';
import MovieList from './Components/MovieList';
import ErrorMessage from './Components/ErrorMessage';
import MovieDetails from './Components/MovieDetails';
import WatchedMoviesList from './Components/WatchedMoviesList';
import WatchedSummary from './Components/WatchedSummary';

export const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = '29b2dacb';

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleRemoveWatched(movieId) {
    setWatched(watched => watched.filter(movie => movie.imdbId !== movieId));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      //
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          //
          if (!res.ok)
            throw new Error('Something went wrong with fetching movies!');
          //
          const data = await res.json();
          //
          if (data.Response === 'False') throw new Error('Movie not found');
          //
          setMovies(data.Search);
          setError('');
        } catch (error) {
          if (error.name !== 'AbortError') {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      //
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }
      //
      handleCloseMovie();
      fetchMovies();
      //
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* This box represents the left side of movies list */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {/* This box is for the right side (watched & summary section) */}
          {selectedId ? (
            <MovieDetails
              key={selectedId}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                key={watched.length}
                watched={watched}
                removeWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
