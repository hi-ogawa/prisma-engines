use std::sync::Arc;

use psl::SourceFile;
use schema_connector::SchemaConnector;
// use schema_core::{
//     commands,
//     json_rpc::types::{DiffParams, DiffTarget},
//     // schema_to_connector_unchecked,
// };
use sql_schema_connector::SqlSchemaConnector;

// cargo run --release -p schema-core --example dev
// cargo run -p schema-core --example dev

// TODO:
// - choose features to minimize binary?
// - napi build as a simple schema diff library without IO (fs or db)?
// - is wasm-bindgen build possible since no IO needed for raw prisma schema diff feature?
// - frontend? (prisma.schema editor? generate raw sql for migration?)

#[tokio::main]
async fn main() {
    // diff via "commands"
    // let diff_params = DiffParams {
    //     from: DiffTarget::Empty,
    //     to: DiffTarget::Empty,
    //     shadow_database_url: None,
    //     script: false,
    //     exit_code: None,
    // };
    // let result = commands::diff(diff_params, Arc::new(schema_connector::EmptyHost)).await;
    // dbg!(&result);

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
    let mut connector = SqlSchemaConnector::new_postgres();
    dbg!(connector.connector_type());

    // read prisma schema
    let schema_from_contents = r#"
        model counter {
            id    Int @id @default(autoincrement())
        }
    "#;
    let schema_from = connector
        .database_schema_from_diff_target(
            schema_connector::DiffTarget::Datamodel(SourceFile::new_allocated(Arc::from(schema_from_contents))),
            None,
            None,
        )
        .await
        .expect("invalid schema");

    let schema_to_contents = r#"
        model counter {
            id    Int @id @default(autoincrement())
            value Int
        }
    "#;
    let schema_to = connector
        .database_schema_from_diff_target(
            schema_connector::DiffTarget::Datamodel(SourceFile::new_allocated(Arc::from(schema_to_contents))),
            None,
            None,
        )
        .await
        .expect("invalid schema");

    // run connector.diff
    let migration = connector.diff(schema_from, schema_to);
    let script_string = connector.render_script(&migration, &Default::default());

    if let Ok(script) = script_string {
        println!("{}", script);
    } else {
        dbg!(&script_string);
    }
}
