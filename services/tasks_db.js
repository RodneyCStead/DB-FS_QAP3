const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'QAP3_DB&FS',
  password: 'Lilly',
  port: 5432,
});
module.exports = pool;