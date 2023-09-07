import { useState } from 'react';
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
import { useMovies } from './CustomHooks/useMovies';
import { useLocalStorageState } from './CustomHooks/useLocalStorageState';

export const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = '29b2dacb';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

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
