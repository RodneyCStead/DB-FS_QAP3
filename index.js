// Imports
const express = require('express');
const methodOverride = require('method-override');

// Initialize express application

const app = express();
const port = 3000;


global.DEBUG = true; 

// Import task-related functions from the Data Access Layer (DAL)
const { getTasks } = require('./services/m.tasks.dal');
const { addTask } = require('./services/m.tasks.dal');
const { updateTask } = require('./services/m.tasks.dal');
const { getTaskById } = require('./services/m.tasks.dal');
const { patchTask } = require('./services/m.tasks.dal');
const { deleteTask } = require('./services/m.tasks.dal');

// Middleware setup
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Defines a route to handle GET requests for the '/tasks' endpoint
app.get('/tasks', async (req, res) => {
  try {
    // Call the getTasks function to retrieve all tasks from the database
    const tasks = await getTasks();
    // Use the 'tasks' view template to render the tasks on the webpage, passing the tasks data as context
    res.render('tasks', { tasks });
  } catch (error) {
    // If an error occurs during the fetch operation, log the error and respond with a 500 status code and a server error message
    console.error('Error fetching tasks:', error);
    res.status(500).send('Server error');
  }
});


// Defines a route to handle POST requests for creating a new task
app.post('/tasks/create', async (req, res) => {
  try {
    // Call the addTask function, passing the request body. This function is responsible for adding the new task to the database.
    await addTask(req.body);
    // After successfully adding the task, redirect the client to the tasks listing page.
    res.redirect('/tasks');
  } catch (error) {
    // If an error occurs during the task creation, log the error and respond with a 500 status code and a server error message.
    console.error('Error creating task:', error);
    res.status(500).send('Server error');
  }
});

// Route to update an existing task, this is for the PUT method
app.put('/tasks/update/:id', async (req, res) => {
  try {
    // Destructure the task details from the request body
    const { name, description, status, due_date } = req.body;
    
    // Check if all required fields are provided in the request body
    if (!name || !description || !status || !due_date) {
      // If any field is missing, return a 400 status code with an error message
      return res.status(400).send('All fields (name, description, status, due_date) are required.');
    }
    
    // Construct a task object with the provided details and the task ID from the URL parameter
    const task = { id: req.params.id, name, description, status, due_date };
    
    // Call the updateTask function (imported from services/m.tasks.dal.js) to update the task in the database
    await updateTask(task);
    
    // After successful update, redirect the client to the tasks listing page
    res.redirect('/tasks');
  } catch (error) {
    // Log the error to the console and return a 500 status code with a server error message
    console.error('Error updating task:', error);
    res.status(500).send('Server error');
  }
});


// Route to PATCH a task
app.get('/tasks/patch/:id', async (req, res) => {
  try {
    // Extract the 'id' parameter from the request URL and fetch the corresponding task
    const task = await getTaskById(req.params.id);
    // Render the 'tasksPATCH' view, passing the fetched task as data
    res.render('tasksPATCH', { task });
  } catch (error) {
    // Log any errors that occur during fetching the task
    console.error('Error fetching task for patching:', error);
    // Respond with a 500 status code (Server error) if an error occurs
    res.status(500).send('Server error');
  }
});

// Route to PATCH a task
app.patch('/tasks/patch/:id', async (req, res) => {
  try {
    // Extract 'field' and 'value' from the request body. These represent the task field to update and the new value for that field.
    const { field, value } = req.body;
    // Extract the task ID from the URL parameter. This identifies which task to update.
    const taskId = req.params.id;

    // Check if the field to be patched is 'due_date' and if the value does not match the 'yyyy-mm-dd' format.
    if (field === 'due_date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      // If the date format is incorrect, respond with a 400 status code and a message indicating the wrong date format.
      return res.status(400).send('Wrong date format entered. Please use yyyy-mm-dd format.');
    }

    // Call the patchTask function (imported from services/m.tasks.dal.js) to update the specified field of the task in the database.
    await patchTask(taskId, field, value); 
    // After successful update, redirect the client to the tasks listing page.
    res.redirect('/tasks');
  } catch (error) {
    // Log the error to the console and return a 500 status code with a server error message if an exception occurs.
    console.error('Error patching task:', error);
    res.status(500).send('Server error');
  }
});


// Defines a route to handle GET requests for editing a specific task
app.get('/tasks/edit/:id', async (req, res) => {
  try {
    // Retrieve the task by its ID from the database using the getTaskById function
    const task = await getTaskById(req.params.id); 
    // Render the 'tasksPUT' view template, passing the retrieved task as context
    res.render('tasksPUT', { task });
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error('Error fetching task:', error);
    // Respond with a 500 status code and a server error message if an exception occurs
    res.status(500).send('Server error');
  }
});


// Defines a route to handle DELETE requests for a specific task
app.delete('/tasks/delete/:id', async (req, res) => {
  try {
    // Extract the task ID from the URL parameter
    const taskId = req.params.id;
    // Call the deleteTask function to remove the task from the database
    await deleteTask(taskId);
    // After successful deletion, redirect the client to the tasks listing page
    res.redirect('/tasks');
  } catch (error) {
    // Log the error to the console and respond with a 500 status code and error message if an exception occurs
    console.error('Error deleting task:', error);
    res.status(500).send('Server error');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});