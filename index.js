const express = require('express');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

global.DEBUG = true;  
const { getTasks } = require('./services/m.tasks.dal');
const { addTask } = require('./services/m.tasks.dal');
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});