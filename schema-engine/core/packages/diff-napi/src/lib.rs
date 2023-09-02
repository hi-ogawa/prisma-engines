use std::{str::FromStr, sync::Arc};

use napi::Error;
use psl::SourceFile;
use psl_core::datamodel_connector::Flavour;
use schema_connector::SchemaConnector;
use sql_schema_connector::SqlSchemaConnector;

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn diff_schema(
    flavor_string: String,
    schema_string_from: String,
    schema_string_to: String,
) -> Result<String, Error> {
    // instantiate connector
    let flavor = Flavour::from_str(&flavor_string).map_err(Error::from_reason)?;
    let mut connector = match flavor {
        Flavour::Cockroach => Ok(SqlSchemaConnector::new_cockroach()),
        Flavour::Mongo => Err(Error::from_reason("Unsupported flavor")),
        Flavour::Mysql => Ok(SqlSchemaConnector::new_mysql()),
        Flavour::Postgres => Ok(SqlSchemaConnector::new_postgres()),
        Flavour::Sqlite => Ok(SqlSchemaConnector::new_sqlite()),
        Flavour::Sqlserver => Ok(SqlSchemaConnector::new_mssql()),
    }?;

    let schema_from = connector
        .db_schema_from_schema_string(&schema_string_from)
        .map_err(|e| Error::from_reason(e.to_string()))?;
    let schema_to = connector
        .db_schema_from_schema_string(&schema_string_to)
        .map_err(|e| Error::from_reason(e.to_string()))?;

    // compute diff and render sql
    let migration = connector.diff(schema_from, schema_to);
    let script_string = connector
        .render_script(&migration, &Default::default())
        .map_err(|e| Error::from_reason(e.to_string()))?;
    Ok(script_string)
}

#[napi]
pub fn diff_schema2(
    flavor_string: String,
    schema_string_from: String,
    schema_string_to: String,
) -> Result<String, Error> {
    // instantiate connector
    let flavor = Flavour::from_str(&flavor_string).map_err(Error::from_reason)?;
    let mut connector = match flavor {
        Flavour::Cockroach => Ok(SqlSchemaConnector::new_cockroach()),
        Flavour::Mongo => Err(Error::from_reason("Unsupported flavor")),
        Flavour::Mysql => Ok(SqlSchemaConnector::new_mysql()),
        Flavour::Postgres => Ok(SqlSchemaConnector::new_postgres()),
        Flavour::Sqlite => Ok(SqlSchemaConnector::new_sqlite()),
        Flavour::Sqlserver => Ok(SqlSchemaConnector::new_mssql()),
    }?;

    // use direct tokio block_on since napi::bindgen_prelude::block_on seems to have wrong typing
    let async_rt = tokio::runtime::Builder::new_current_thread()
        .build()
        .map_err(|e| Error::from_reason(e.to_string()))?;

    // parse prisma schema
    let schema_from = async_rt
        .block_on(connector.database_schema_from_diff_target(
            diff_target_from_schema_string(&schema_string_from),
            None,
            None,
        ))
        .map_err(|e| Error::from_reason(e.to_string()))?;

    let schema_to = async_rt
        .block_on(connector.database_schema_from_diff_target(
            diff_target_from_schema_string(&schema_string_to),
            None,
            None,
        ))
        .map_err(|e| Error::from_reason(e.to_string()))?;

    // compute diff and render sql
    let migration = connector.diff(schema_from, schema_to);
    let script_string = connector
        .render_script(&migration, &Default::default())
        .map_err(|e| Error::from_reason(e.to_string()))?;
    Ok(script_string)
}

fn diff_target_from_schema_string(input: &str) -> schema_connector::DiffTarget {
    schema_connector::DiffTarget::Datamodel(SourceFile::new_allocated(Arc::from(input)))
}
