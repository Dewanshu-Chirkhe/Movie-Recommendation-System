export default function SearchBar({ query, setQuery, onSearch, loading }) {
    function handleSubmit(event) {
        event.preventDefault();

        if (query.trim()) {
            onSearch();
        }
    }

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a movie..."
                aria-label="Search for a movie"
            />

            <button type="submit" disabled={loading || !query.trim()}>
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}
