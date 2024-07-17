const express = require('express');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Define routes here

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});