use schema_connector::SchemaConnector;
use sql_schema_connector::SqlSchemaConnector;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let connector = SqlSchemaConnector::new_postgres();

    let schema_str_from = r#"
      model counter {
        id    Int @id @default(autoincrement())
      }
    "#;
    let schema_str_to = r#"
      model counter {
        id    Int @id @default(autoincrement())
        value Int
      }
    "#;

    let schema_from = connector.db_schema_from_schema_string(schema_str_from)?;
    let schema_to = connector.db_schema_from_schema_string(schema_str_to)?;

    let migration = connector.diff(schema_from, schema_to);
    let script = connector.render_script(&migration, &Default::default())?;
    println!("{}", script);

    Ok(())
}

// cargo run -p sql-schema-connector --example diff --features slim
// cargo build -p sql-schema-connector --example diff --features slim --target wasm32-unknown-unknown
