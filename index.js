const express = require('express');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

global.DEBUG = true;  
const { getTasks } = require('./services/m.tasks.dal');
const { addTask } = require('./services/m.tasks.dal');
const { updateTask } = require('./services/m.tasks.dal');
const { getTaskById } = require('./services/m.tasks.dal');
const { patchTask } = require('./services/m.tasks.dal');
const { deleteTask } = require('./services/m.tasks.dal');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await getTasks();
    // Render the tasksView.ejs file and pass the tasks data to it
    res.render('tasks', { tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Server error');
  }
});

app.post('/tasks/create', async (req, res) => {
  try {
      await addTask(req.body);
      res.redirect('/tasks');
  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).send('Server error');
  }
});

app.put('/tasks/update/:id', async (req, res) => {
  try {
    const { name, description, status, due_date } = req.body;
    if (!name || !description || !status || !due_date) {
      return res.status(400).send('All fields (name, description, status, due_date) are required.');
    }
    const task = { id: req.params.id, name, description, status, due_date };
    await updateTask(task);
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Server error');
  }
});

app.get('/tasks/patch/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    res.render('tasksPATCH', { task });
  } catch (error) {
    console.error('Error fetching task for patching:', error);
    res.status(500).send('Server error');
  }
});

app.patch('/tasks/patch/:id', async (req, res) => {
  try {
    const { field, value } = req.body;
    const taskId = req.params.id;

    // Check if the field to be patched is 'due_date' and if the value matches 'yyyy-mm-dd' format
    if (field === 'due_date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      // Respond with a message indicating the wrong date format
      return res.status(400).send('Wrong date format entered. Please use yyyy-mm-dd format.');
    }

    await patchTask(taskId, field, value); 
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error patching task:', error);
    res.status(500).send('Server error');
  }
});

app.get('/tasks/edit/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id); 
    res.render('tasksPUT', { task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).send('Server error');
  }
});


app.delete('/tasks/delete/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    // Assuming deleteTask is a function that executes the SQL DELETE statement
    await deleteTask(taskId);
    res.redirect('/tasks');
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});