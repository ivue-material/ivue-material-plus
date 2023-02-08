#!/bin/sh

set -e

pnpm build

cd dist/ivue-material-plus
npm publish
cd -

cd internal/eslint-config
npm publish
cd -

cd internal/metadata
pnpm build
npm publish
cd -

echo "✅ Publish completed"
