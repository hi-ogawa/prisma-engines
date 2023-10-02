use schema_connector::SchemaConnector;
use sql_schema_connector::SqlSchemaConnector;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // example schema.prisma
    let schema_str_from = r#"
      datasource db {
        provider = "mysql"
        url      = "__dummy_url"
      }
      model counter {
        id    Int @id @default(autoincrement())
      }
    "#;
    let schema_str_to = r#"
      datasource db {
        provider = "mysql"
        url      = "__dummy_url"
      }
      model counter {
        id    Int @id @default(autoincrement())
        value Int
      }
    "#;

    // extract "datasource/provider"
    let schema_from = psl::parse_schema(schema_str_from)?;
    let schema_to = psl::parse_schema(schema_str_to)?;
    let provider_from = schema_from.connector.provider_name();
    let provider_to = schema_to.connector.provider_name();
    if provider_from != provider_to {
        Err(format!("provider mismatch: {} != {}", provider_from, provider_to))?;
    }

    // instantiate connector
    let connector = match provider_from {
        "cockroach" => Ok(SqlSchemaConnector::new_cockroach()),
        "mysql" => Ok(SqlSchemaConnector::new_mysql()),
        "postgres" => Ok(SqlSchemaConnector::new_postgres()),
        "sqlite" => Ok(SqlSchemaConnector::new_sqlite()),
        "mssql" => Ok(SqlSchemaConnector::new_mssql()),
        _ => Err("Unsupported flavour"),
    }?;

    // run diff
    let db_schema_from = connector.db_schema_from_schema(&schema_from)?;
    let db_schema_to = connector.db_schema_from_schema(&schema_to)?;
    let migration = connector.diff(db_schema_from, db_schema_to);
    let script = connector.render_script(&migration, &Default::default())?;
    println!("{}", script);

    Ok(())
}

// cargo run -p sql-schema-connector --example diff --features slim
// cargo build -p sql-schema-connector --example diff --features slim --target wasm32-unknown-unknown
