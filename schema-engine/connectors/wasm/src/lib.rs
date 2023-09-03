use schema_connector::SchemaConnector;
use sql_schema_connector::SqlSchemaConnector;
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn schema_diff(flavour: String, schema_from: String, schema_to: String) -> Result<String, JsError> {
    let connector = match flavour.as_str() {
        "cockroach" => Ok(SqlSchemaConnector::new_cockroach()),
        "mysql" => Ok(SqlSchemaConnector::new_mysql()),
        "postgres" => Ok(SqlSchemaConnector::new_postgres()),
        "sqlite" => Ok(SqlSchemaConnector::new_sqlite()),
        "mssql" => Ok(SqlSchemaConnector::new_mssql()),
        _ => Err(JsError::new("Unsupported flavour")),
    }?;
    let schema_from = connector.db_schema_from_schema_string(&schema_from)?;
    let schema_to = connector.db_schema_from_schema_string(&schema_to)?;
    let migration = connector.diff(schema_from, schema_to);
    let script = connector.render_script(&migration, &Default::default())?;
    Ok(script)
}
