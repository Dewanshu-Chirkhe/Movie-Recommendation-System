import { getPosterUrl } from "../services/tmdb";

export default function MovieCard({ movie, onSelect, showSimilarity = false }) {
    const posterUrl = getPosterUrl(movie.poster_path);

    return (
        <article
            className="movie-card"
            onClick={() => onSelect?.(movie)}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onKeyDown={(event) => {
                if (onSelect && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onSelect(movie);
                }
            }}
        >
            <div className="poster-container">
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={`${movie.title} poster`}
                        className="movie-poster"
                        loading="lazy"
                    />
                ) : (
                    <div className="poster-placeholder">
                        <span>No poster available</span>
                    </div>
                )}

                {showSimilarity && movie.similarity !== undefined && (
                    <span className="similarity-badge">
                        {Math.round(movie.similarity * 100)}% match
                    </span>
                )}
            </div>

            <div className="movie-info">
                <h3>{movie.title}</h3>

                <p className="movie-meta">
                    {movie.release_date?.slice(0, 4) || "Year unknown"}
                    {" · "}
                    {movie.vote_average != null
                        ? `★ ${Number(movie.vote_average).toFixed(1)}`
                        : "Rating unavailable"}
                </p>

                <div className="genre-list">
                    {(movie.genres || []).map((genre) => (
                        <span key={genre.id ?? genre} className="genre-tag">
                            {typeof genre === "string" ? genre : genre.name}
                        </span>
                    ))}
                </div>

                {movie.overview && (
                    <p className="movie-overview">{movie.overview}</p>
                )}
            </div>
        </article>
    );
}
