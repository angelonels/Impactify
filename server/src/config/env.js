const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

function loadEnv() {
  // env is loaded by dotenv on import
}

module.exports = { loadEnv };


