const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(url) {
    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.detail || `API request failed: ${response.status}`,
        );
    }

    return response.json();
}

export async function searchMovies(query) {
    const params = new URLSearchParams({
        q: query,
        limit: "10",
    });

    return request(`${API_BASE_URL}/api/movies/search?${params.toString()}`);
}

export async function getRecommendations(movieId, k = 10) {
    const params = new URLSearchParams({
        k: String(k),
    });

    return request(
        `${API_BASE_URL}/api/movies/${movieId}/recommendations?${params.toString()}`,
    );
}
