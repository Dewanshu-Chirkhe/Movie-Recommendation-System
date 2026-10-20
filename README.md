<div align="center">

# Movie Recommendation System

### Discover movies with similar genres.

A content-based movie recommendation system that retrieves and ranks movies based on genre similarity. Built using Python, FastAPI, and Scikit-learn, with TMDB integration for movie posters and details.

<p>
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Scikit--learn-IR- F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white" />
</p>

</div>

---

## About the Project

This movie recommendation system is built using Information Retrieval techniques. It represents movie genres as binary vectors and uses cosine similarity to retrieve the top-K movies with similar genres.

Users can search for a movie and explore recommendations along with posters, ratings, and other details fetched from TMDB.

## Features

- **Movie Search:** Search movies by title.
- **Genre-Based Retrieval:** Find movies with similar genres.
- **Similarity Ranking:** Rank movies using cosine similarity.
- **Top-K Recommendations:** Retrieve the most similar movies.
- **Movie Details:** Display posters, ratings, and overviews using TMDB.
- **REST API:** Serve search results and recommendations using FastAPI.

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| Pandas | Dataset processing |
| Scikit-learn | Genre vectorization and cosine similarity |
| React + Vite | Frontend |
| TMDB API | Movie posters and metadata |
| TMDB 5000 Dataset | Movie data |

## How It Works

1. **Movie Search:** Users search for a movie by title.
2. **Genre Extraction:** Extract genre information from the dataset.
3. **Vectorization:** Convert genres into binary vectors using `MultiLabelBinarizer`.
4. **Similarity Calculation:** Calculate cosine similarity between movie vectors.
5. **Top-K Retrieval:** Rank candidates and return the most similar movies.
6. **Movie Display:** Fetch additional details from TMDB and display recommendations.

## Architecture

```text
          React Frontend
                |
                v
          FastAPI Backend
                |
                v
          TMDB 5000 Dataset
                |
                v
         Genre Vectorization
                |
                v
         Cosine Similarity
                |
                v
          Top-K Retrieval
                |
                v
       Recommended Movie IDs
                |
                v
             TMDB API
                |
                v
       Posters and Movie Details