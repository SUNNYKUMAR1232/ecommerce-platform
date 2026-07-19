import os

from fastapi import FastAPI

app = FastAPI(title="review-service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"service": "review-service", "status": "ok"}


def port() -> int:
    return int(os.getenv("PORT", "8089"))
