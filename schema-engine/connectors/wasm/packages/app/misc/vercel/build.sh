#!/bin/bash
set -eu -o pipefail

this_dir="$(dirname "${BASH_SOURCE[0]}")"

rm -rf .vercel/output
mkdir -p .vercel/output
cp -r dist .vercel/output/static
cp "$this_dir/config.json" .vercel/output
