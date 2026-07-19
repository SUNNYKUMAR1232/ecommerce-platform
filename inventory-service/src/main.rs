use std::{env, net::SocketAddr};

use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "8084".to_string());

    let address: SocketAddr = format!("0.0.0.0:{port}")
        .parse()
        .expect("valid bind address");

    let app = Router::new().route("/health", get(health));

    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("bind listener");

    axum::serve(listener, app)
        .await
        .expect("serve inventory-service");
}

async fn health() -> &'static str {
    "OK"
}