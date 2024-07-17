const pool = require("./tasks_db");

var getTasks = async () => {
    const { rows } = await pool.query('SELECT * FROM Tasks');
    return rows;
  };


module.exports = {getTasks};

