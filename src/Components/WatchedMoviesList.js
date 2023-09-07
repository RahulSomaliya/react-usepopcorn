export default function WatchedMoviesList({ watched, removeWatched }) {
  return (
    <ul className='list'>
      {watched.map((movie, i) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          removeWatched={removeWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, removeWatched }) {
  const { imdbId, title, imdbRating, userRating, runtime, poster } = movie;

  return (
    <li key={imdbId}>
      <img src={poster} alt={`Poster of ${title} movie`} />
      <h3>{title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime} min</span>
        </p>

        <button className='btn-delete' onClick={() => removeWatched(imdbId)}>
          X
        </button>
      </div>
    </li>
  );
}
