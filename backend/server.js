// using express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

// connecting mongodb (Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ DB Connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.log('❌ DB Connection Error: ', err);
  });

// creating schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: String
});

// creating model
const todoModel = mongoose.model('Todo', todoSchema);

// create a new todo item
app.post("/todo", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get all items
app.get('/todo', async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// update todo item
app.put("/todo/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete todo item
app.delete("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("🚀 Server listening on port " + port);
});
