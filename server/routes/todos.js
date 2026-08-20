import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET /api/todos — get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos — create a new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const newTodo = await Todo.create({ text });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PATCH /api/todos/:id — update a todo
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id — delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;