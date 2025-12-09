const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task'); // Make sure Task schema is correct

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/todoDB')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a task
// POST /tasks
app.post('/tasks', async (req, res) => {
  try {
   const task = new Task({
  text: req.body.text?.trim(),
  day: req.body.day?.trim() || "",
  reminder: req.body.reminder ?? false
});


    const savedTask = await task.save();
    res.status(201).json(savedTask);   // RETURN FULL TASK
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

   await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task (toggle reminder)
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.reminder = req.body.reminder;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

app.listen(5000, () => console.log('Server running on port 5000'));
