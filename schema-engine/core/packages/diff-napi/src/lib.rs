use std::sync::Arc;

use napi::Error;
use psl::SourceFile;
use schema_connector::SchemaConnector;
use sql_schema_connector::SqlSchemaConnector;

#[macro_use]
extern crate napi_derive;

#[napi]
pub async fn diff_schema(schema_string_from: String, schema_string_to: String) -> Result<String, Error> {
    // TODO: ability to choose differnt connector
    let mut connector = SqlSchemaConnector::new_postgres();

    let schema_from = connector
        .database_schema_from_diff_target(diff_target_from_schema_string(&schema_string_from), None, None)
        .await
        .map_err(|e| Error::from_reason(e.to_string()))?;

    let schema_to = connector
        .database_schema_from_diff_target(diff_target_from_schema_string(&schema_string_to), None, None)
        .await
        .map_err(|e| Error::from_reason(e.to_string()))?;

    let migration = connector.diff(schema_from, schema_to);
    let script_string = connector
        .render_script(&migration, &Default::default())
        .map_err(|e| Error::from_reason(e.to_string()))?;
    Ok(script_string)
}

fn diff_target_from_schema_string(input: &str) -> schema_connector::DiffTarget {
    schema_connector::DiffTarget::Datamodel(SourceFile::new_allocated(Arc::from(input)))
}
