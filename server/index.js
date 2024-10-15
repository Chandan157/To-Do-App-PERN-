const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require("./db");

//Middleware
app.use(cors());
app.use(express.json());

//Routes
//Create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "Insert into todo (description) values($1) returning *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//Get all todo
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("Select * from todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//Get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.send(oneTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const update = await pool.query(
      "update todo set description=$1 where todo_id=$2",
      [description, id]
    );
    res.send(`Successfully Updated`);
  } catch (err) {
    console.log(err.message);
  }
});

//Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const todoid = req.params.id;
  try {
    const remove = await pool.query(
      "delete from todo where todo_id=$1",
      todoid
    );
    res.send(`Successfully Deleted`);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello jii");
});

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
