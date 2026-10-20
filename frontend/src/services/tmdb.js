const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

export async function getMovieDetails(movieId) {
    if (!TMDB_TOKEN) {
        throw new Error("TMDB API token is not configured.");
    }

    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}`, {
        headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`);
    }

    return response.json();
}

export function getPosterUrl(posterPath, size = "w500") {
    if (!posterPath) {
        return null;
    }

    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

export function getBackdropUrl(backdropPath, size = "w1280") {
    if (!backdropPath) {
        return null;
    }

    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}
