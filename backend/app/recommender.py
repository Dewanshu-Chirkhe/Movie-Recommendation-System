import pandas as pd
import numpy as np

from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

from app.data_loader import load_movies


class MovieRecommender:

    def __init__(self):
        # Load and preprocess the dataset.
        self.movies = load_movies()

        # Build a unique vocabulary of genres.
        self.encoder = MultiLabelBinarizer()

        # Convert genre lists into binary vectors.
        self.genre_matrix = self.encoder.fit_transform(
            self.movies["genres"]
        )

        # Precompute cosine similarities for all movies.
        self.similarity_matrix = cosine_similarity(
            self.genre_matrix
        )

        # Map movie IDs to their row positions.
        self.movie_id_to_index = {
            int(movie_id): index
            for index, movie_id in enumerate(
                self.movies["id"]
            )
        }

    def search_movies(self, query, limit=10):
        """
        Search for movies by title.
        """

        query = query.strip().lower()

        if not query:
            return []

        matches = self.movies[
            self.movies["title"]
            .str.lower()
            .str.contains(query, regex=False, na=False)
        ]

        matches = matches.head(limit)

        return [
            {
                "id": int(row["id"]),
                "title": row["title"],
                "genres": row["genres"],
                "vote_average": (
                    float(row["vote_average"])
                    if not np.isnan(
                        row["vote_average"]
                    )
                    else None
                )
            }
            for _, row in matches.iterrows()
        ]

    def recommend_movies(self, movie_id, k=10):
        """
        Return the top-K movies with similar genres.
        """

        if movie_id not in self.movie_id_to_index:
            raise ValueError("Movie not found")

        if k < 1:
            raise ValueError(
                "k must be greater than or equal to 1"
            )

        query_index = self.movie_id_to_index[movie_id]

        # Get similarity scores for the query movie.
        scores = self.similarity_matrix[query_index]

        # Sort candidate indices by descending similarity.
        ranked_indices = np.argsort(-scores)

        recommendations = []

        for index in ranked_indices:

            # Do not recommend the queried movie itself.
            if index == query_index:
                continue

            score = float(scores[index])

            # Exclude movies that have no genres in common.
            if score <= 0:
                continue

            row = self.movies.iloc[index]

            vote_average = row["vote_average"]

            recommendations.append(
                {
                    "id": int(row["id"]),
                    "title": row["title"],
                    "genres": row["genres"],
                    "similarity": round(score, 4),
                    "vote_average": (
                        float(vote_average)
                        if pd.notna(vote_average)
                        else None
                    )
                }
            )

            if len(recommendations) == k:
                break

        return recommendations