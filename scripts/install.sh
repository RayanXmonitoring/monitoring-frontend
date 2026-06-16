#!/bin/bash

echo "🔧 Installing with fixed versions..."

# Remove node_modules and lock files
rm -rf node_modules
rm -rf package-lock.json

# Install with specific versions
npm install --legacy-peer-deps --no-audit

# Force ajv version
npm install ajv@6.12.6 --save-dev --legacy-peer-deps --no-audit
npm install ajv-keywords@3.5.2 --save-dev --legacy-peer-deps --no-audit
npm install schema-utils@3.3.0 --save-dev --legacy-peer-deps --no-audit

# Build
npm run build
