const fs = require('fs');
const path = require('path');

const schemaUtilsPath = path.join(__dirname, '../node_modules/schema-utils/dist/validate.js');

if (fs.existsSync(schemaUtilsPath)) {
  let content = fs.readFileSync(schemaUtilsPath, 'utf8');
  
  // Replace ajv-keywords import
  content = content.replace(
    /require\(['"]ajv-keywords['"]\)/g,
    'require("ajv-keywords")'
  );
  
  // Add ajv configuration
  content = content.replace(
    /const ajv = new Ajv\([^)]*\)/,
    'const ajv = new Ajv({ allErrors: true, jsonPointers: true })'
  );
  
  fs.writeFileSync(schemaUtilsPath, content);
  console.log('✅ Schema-utils patched successfully!');
} else {
  console.error('❌ Schema-utils not found!');
}
