use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use std::{env, net::SocketAddr};

async fn health() -> Json<Value> {
    Json(json!({ "service": "payment-service", "status": "ok" }))
}

#[tokio::main]
async fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "8087".to_string());
    let address: SocketAddr = format!("0.0.0.0:{port}")
        .parse()
        .expect("valid bind address");
    let app = Router::new().route("/health", get(health));
    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("bind listener");

    axum::serve(listener, app)
        .await
        .expect("serve payment-service");
}
