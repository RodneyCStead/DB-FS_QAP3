const pool = require("./tasks_db");

var getTasks = async () => {
    const { rows } = await pool.query('SELECT * FROM Tasks');
    return rows;
  };

var addTask = async (task) => {
  const { name, description, status, due_date } = task;
  await pool.query('INSERT INTO Tasks (name, description, status, due_date) VALUES ($1, $2, $3, $4)', [name, description, status, due_date]);
  };

var updateTask = async (task) => {
  const { id, name, description, status, due_date } = task;
  await pool.query('UPDATE Tasks SET name=$2, description=$3, status=$4, due_date=$5 WHERE id=$1', [id, name, description, status, due_date]);
  };


module.exports = {
  getTasks,
  addTask,
  updateTask
};

