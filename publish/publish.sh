#!/bin/sh

set -e

# pnpm build

cd dist/ivue-material-plus
npm publish
cd -

cd build-install/eslint-config
npm publish
cd -

echo "✅ Publish completed"
