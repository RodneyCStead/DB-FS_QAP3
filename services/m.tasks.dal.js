const pool = require("./tasks_db");

var getTasks = async () => {
    const { rows } = await pool.query('SELECT * FROM Tasks ORDER BY id ASC');
    return rows;
  };

// Add task, used in POST method
var addTask = async (task) => {
  const { name, description, status, due_date } = task;
  await pool.query('INSERT INTO Tasks (name, description, status, due_date) VALUES ($1, $2, $3, $4)', [name, description, status, due_date]);
  };

// Update task, used in the PUT method
var updateTask = async (task) => {
  const { id, name, description, status, due_date } = task;
  await pool.query('UPDATE Tasks SET name=$2, description=$3, status=$4, due_date=$5 WHERE id=$1', [id, name, description, status, due_date]);
  };

// Get task by id used in PATCH, GET, DELETE methods
var getTaskById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM Tasks WHERE id=$1', [id]);
  return rows[0];
  };

// Patch function
var patchTask = async (taskId, field, value) => {
  const query = `UPDATE Tasks SET ${field}=$1 WHERE id=$2`;
  await pool.query(query, [value, taskId]);
};
  

// Delete function
async function deleteTask(taskId) {
  const query = 'DELETE FROM Tasks WHERE id = $1';
  await pool.query(query, [taskId]);
}


module.exports = {
  getTasks,
  addTask,
  updateTask,
  getTaskById,
  patchTask,
  deleteTask
};

