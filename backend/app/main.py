from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.recommender import MovieRecommender


recommender = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global recommender

    # Load the dataset and build the recommendation engine
    # once when the application starts.
    recommender = MovieRecommender()

    yield

    recommender = None


app = FastAPI(
    title="CineMatch API",
    description="Genre-based movie recommendation system",
    version="1.0.0",
    lifespan=lifespan
)


# Allow requests from the local React development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {
        "message": "Welcome to CineMatch API",
        "docs": "/docs"
    }


@app.get("/api/movies/search")
def search_movies(
    q: str = Query(
        ...,
        min_length=1,
        description="Movie title to search for"
    ),
    limit: int = Query(
        10,
        ge=1,
        le=50
    )
):
    return {
        "results": recommender.search_movies(
            query=q,
            limit=limit
        )
    }


@app.get("/api/movies/{movie_id}/recommendations")
def get_recommendations(
    movie_id: int,
    k: int = Query(
        10,
        ge=1,
        le=50
    )
):
    try:
        recommendations = recommender.recommend_movies(
            movie_id=movie_id,
            k=k
        )

        return {
            "query_movie": next(
                {
                    "id": int(row["id"]),
                    "title": row["title"],
                    "genres": row["genres"]
                }
                for _, row in recommender.movies.iterrows()
                if int(row["id"]) == movie_id
            ),
            "count": len(recommendations),
            "recommendations": recommendations
        }

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )