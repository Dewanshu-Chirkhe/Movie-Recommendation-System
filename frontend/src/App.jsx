import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";

import { searchMovies, getRecommendations } from "./services/api";

import { getMovieDetails } from "./services/tmdb";

import "./App.css";

export default function App() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch() {
        setLoading(true);
        setError("");
        setSelectedMovie(null);
        setRecommendations([]);

        try {
            const data = await searchMovies(query.trim());
            setSearchResults(data.results || []);

            if (!data.results?.length) {
                setError("No movies found. Try another title.");
            }
        } catch (err) {
            setError(err.message || "Unable to search movies.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSelectMovie(movie) {
        setLoading(true);
        setError("");
        setSearchResults([]);
        setSelectedMovie(null);
        setRecommendations([]);

        try {
            const data = await getRecommendations(movie.id, 10);

            let selectedDetails = {};

            try {
                selectedDetails = await getMovieDetails(movie.id);
            } catch {
                // Continue if TMDB details are unavailable.
            }

            setSelectedMovie({
                ...movie,
                ...selectedDetails,
                genres: movie.genres,
            });

            const enrichedMovies = await Promise.all(
                (data.recommendations || []).map(async (item) => {
                    try {
                        const details = await getMovieDetails(item.id);

                        return {
                            ...item,
                            ...details,
                            genres: item.genres,
                            similarity: item.similarity,
                        };
                    } catch {
                        return {
                            ...item,
                            poster_path: null,
                        };
                    }
                }),
            );

            setRecommendations(enrichedMovies);
        } catch (err) {
            setError(err.message || "Unable to load recommendations.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app">
            <main className="main-content">
                <section className="search-section">
                    <h2>Movie Recommendations System</h2>

                    <p>
                        Search for a movie to find other movies with similar
                        genres.
                    </p>

                    <SearchBar
                        query={query}
                        setQuery={setQuery}
                        onSearch={handleSearch}
                        loading={loading}
                    />
                </section>

                {error && <p className="error-message">{error}</p>}

                {searchResults.length > 0 && (
                    <section className="section">
                        <h3>Search Results</h3>

                        <div className="search-results">
                            {searchResults.map((movie) => (
                                <button
                                    key={movie.id}
                                    className="search-result"
                                    onClick={() => handleSelectMovie(movie)}
                                >
                                    <span>{movie.title}</span>
                                    <span className="select-label">Select</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {loading && <p className="loading-message">Loading...</p>}

                {selectedMovie && (
                    <>
                        {/* Selected Movie Card */}
                        <section className="selected-movie-card">
                            <div className="selected-movie-poster">
                                {selectedMovie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                                        alt={`${selectedMovie.title} poster`}
                                    />
                                ) : (
                                    <div className="selected-poster-placeholder">
                                        No poster available
                                    </div>
                                )}
                            </div>

                            <div className="selected-movie-details">
                                <p className="selected-label">SEARCHED MOVIE</p>

                                <h2>{selectedMovie.title}</h2>

                                <div className="selected-movie-meta">
                                    {selectedMovie.release_date && (
                                        <span>
                                            {selectedMovie.release_date.slice(
                                                0,
                                                4,
                                            )}
                                        </span>
                                    )}

                                    {selectedMovie.vote_average != null && (
                                        <span>
                                            ★{" "}
                                            {Number(
                                                selectedMovie.vote_average,
                                            ).toFixed(1)}
                                            /10
                                        </span>
                                    )}
                                </div>

                                <div className="selected-genres">
                                    {(selectedMovie.genres || []).map(
                                        (genre) => (
                                            <span key={genre.id ?? genre}>
                                                {typeof genre === "string"
                                                    ? genre
                                                    : genre.name}
                                            </span>
                                        ),
                                    )}
                                </div>

                                <p className="selected-overview">
                                    {selectedMovie.overview ||
                                        "No overview available for this movie."}
                                </p>
                            </div>
                        </section>

                        {/* Recommendations */}
                        <section className="section">
                            <div className="recommendation-heading">
                                <h3>Recommended Movies</h3>
                                <span>{recommendations.length} results</span>
                            </div>

                            {recommendations.length > 0 ? (
                                <div className="movie-grid">
                                    {recommendations.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            showSimilarity
                                            onSelect={handleSelectMovie}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>No similar movies were found.</p>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
