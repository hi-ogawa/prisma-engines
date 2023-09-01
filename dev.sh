# { "script": false, "from": { "tag": "empty" }, "to": { "tag": "empty" } }

# { "jsonrpc": "2.0", "id": 1, "method": "diff", "params": { "script": true, "from": { "tag": "empty" }, "to": { "tag": "empty" } } }

echo '{ "jsonrpc": "2.0", "id": 1, "method": "diff", "params": { "script": true, "from": { "tag": "empty" }, "to": { "tag": "empty" } } }' | ./target/debug/schema-engine -d query-engine/js-connectors/js/smoke-test-js/prisma/postgres/schema.prisma

echo '{ "jsonrpc": "2.0", "id": 1, "method": "diff", "params": { "script": true, "from": { "tag": "empty" }, "to": { "tag": "empty" } } }' | ./target/debug/schema-engine

echo '{ "jsonrpc": "2.0", "id": 1, "method": "diff", "params": { "script": true, "from": { "tag": "empty" }, "to": { "tag": "schemaDatamodel", "schema": "query-engine/js-connectors/js/smoke-test-js/prisma/postgres/schema.prisma" } } }' | ./target/debug/schema-engine | jq

echo '{ "jsonrpc": "2.0", "id": 1, "method": "diff", "params": { "script": true, "from": { "tag": "empty" }, "to": { "tag": "schemaDatamodel", "schema": "query-engine/js-connectors/js/smoke-test-js/prisma/postgres/schema.prisma" } } }' | ./target/debug/schema-engine | jq -r .params.content
