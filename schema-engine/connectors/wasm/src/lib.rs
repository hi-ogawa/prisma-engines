use schema_connector::{ConnectorError, SchemaConnector};
use sql_schema_connector::SqlSchemaConnector;
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn schema_diff(schema_from: String, schema_to: String) -> Result<String, JsError> {
    // parse schema.prisma
    let schema_from = psl::parse_schema(&schema_from).map_err(ConnectorError::new_schema_parser_error)?;
    let schema_to = psl::parse_schema(&schema_to).map_err(ConnectorError::new_schema_parser_error)?;

    // instantiate connector
    let provider_to = schema_to.connector.provider_name();
    let connector = match provider_to {
        "cockroach" => Ok(SqlSchemaConnector::new_cockroach()),
        "mysql" => Ok(SqlSchemaConnector::new_mysql()),
        "postgres" => Ok(SqlSchemaConnector::new_postgres()),
        "sqlite" => Ok(SqlSchemaConnector::new_sqlite()),
        "mssql" => Ok(SqlSchemaConnector::new_mssql()),
        _ => Err(JsError::new(&format!("Unsupported provider '{}'", provider_to))),
    }?;

    // run diff
    let db_schema_from = connector.db_schema_from_schema(&schema_from)?;
    let db_schema_to = connector.db_schema_from_schema(&schema_to)?;
    let migration = connector.diff(db_schema_from, db_schema_to);
    let script = connector.render_script(&migration, &Default::default())?;
    Ok(script)
}
