import ast
from pathlib import Path

import pandas as pd


DATASET_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "tmdb_5000_movies.csv"
)


def parse_genres(genre_string):
    """
    Convert the genres column into a list of genre names.

    Example:
    '[{"id": 28, "name": "Action"},
      {"id": 12, "name": "Adventure"}]'

    Becomes:
    ['Action', 'Adventure']
    """

    if pd.isna(genre_string):
        return []

    try:
        genres = ast.literal_eval(genre_string)

        return [
            genre["name"]
            for genre in genres
            if "name" in genre
        ]

    except (ValueError, SyntaxError, TypeError):
        return []


def load_movies():
    """
    Load the dataset and prepare the movie information.
    """

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )

    movies = pd.read_csv(DATASET_PATH)

    required_columns = {"id", "title", "genres"}

    if not required_columns.issubset(movies.columns):
        raise ValueError(
            "Dataset must contain id, title, and genres columns."
        )

    movies = movies[
        ["id", "title", "genres", "vote_average"]
    ].copy()

    movies["genres"] = movies["genres"].apply(parse_genres)

    movies["id"] = pd.to_numeric(
        movies["id"], errors="coerce"
    )

    movies = movies.dropna(
        subset=["id", "title"]
    ).copy()

    movies["id"] = movies["id"].astype(int)

    movies = movies.drop_duplicates(
        subset=["id"]
    ).reset_index(drop=True)

    return movies