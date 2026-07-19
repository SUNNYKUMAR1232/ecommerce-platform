import os

from fastapi import FastAPI

app = FastAPI(title="search-service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"service": "search-service", "status": "ok"}


def port() -> int:
    return int(os.getenv("PORT", "8091"))
