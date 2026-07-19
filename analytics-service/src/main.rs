use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde_json::json;
use std::env;

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({ "service": "analytics-service", "status": "ok" }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = env::var("PORT").unwrap_or_else(|_| "8093".to_string());

    HttpServer::new(|| App::new().service(health).app_data(web::JsonConfig::default()))
        .bind(("0.0.0.0", port.parse::<u16>().expect("valid port")))?
        .run()
        .await
}
