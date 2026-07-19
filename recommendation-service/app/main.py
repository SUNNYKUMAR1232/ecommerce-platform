import os

from fastapi import FastAPI

app = FastAPI(title="recommendation-service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"service": "recommendation-service", "status": "ok"}


def port() -> int:
    return int(os.getenv("PORT", "8092"))
