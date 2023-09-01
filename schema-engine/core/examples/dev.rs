use std::sync::Arc;

use schema_connector::SchemaConnector;
use schema_core::{
    commands,
    json_rpc::types::{DiffParams, DiffTarget},
    // schema_to_connector_unchecked,
};
use sql_schema_connector::SqlSchemaConnector;

// cargo run -p schema-core --example dev

#[tokio::main]
async fn main() {
    // diff via "commands"
    let diff_params = DiffParams {
        from: DiffTarget::Empty,
        to: DiffTarget::Empty,
        shadow_database_url: None,
        script: false,
        exit_code: None,
    };
    let result = commands::diff(diff_params, Arc::new(schema_connector::EmptyHost)).await;
    dbg!(&result);

    // get connector via schema
    // let schema_str = r#"
    //     datasource db {
    //         provider = "postgres"
    //         url = ""
    //     }
    // "#;
    // let result = schema_to_connector_unchecked(schema_str).expect("invalid schema");
    // dbg!(result.connector_type());

    // instantiate connector directly
    let connector = SqlSchemaConnector::new_postgres();
    dbg!(connector.connector_type());

    // run connector.diff
    let from = connector.empty_database_schema();
    let to = connector.empty_database_schema();
    let migration = connector.diff(from, to);
    let script_string = connector.render_script(&migration, &Default::default());
    dbg!(&script_string);
}
