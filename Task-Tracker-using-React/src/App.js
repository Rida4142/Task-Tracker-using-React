import './App.css';
import Header from './Components/Header';
import Tasks from './Components/Tasks';
import AddTask from './Components/AddTask';
import { useState, useEffect } from 'react';

function App() {
  const [showAddTask, setAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend on component mount
  useEffect(() => {
    const getTasks = async () => {
      const res = await fetch('http://localhost:5000/tasks');
      const data = await res.json();
      setTasks(data);
    };
    getTasks();
  }, []);

  // Add task (only updates state, no POST here)
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = tasks.find((task) => task._id === id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminder: updatedTask.reminder }),
    });

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <div className='container'>
      <Header onAdd={() => setAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        <h3>No Tasks</h3>
      )}
    </div>
  );
}

export default App;
