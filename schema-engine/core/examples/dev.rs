use std::sync::Arc;

use schema_core::{
    commands,
    json_rpc::types::{DiffParams, DiffTarget},
};

// cargo run -p schema-core --example dev

#[tokio::main]
async fn main() {
    let diff_params = DiffParams {
        from: DiffTarget::Empty,
        to: DiffTarget::Empty,
        shadow_database_url: None,
        script: false,
        exit_code: None,
    };
    let result = commands::diff(diff_params, Arc::new(schema_connector::EmptyHost)).await;
    println!("{:?}", result);
}
