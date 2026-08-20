import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos when the component first mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        setError('Failed to load todos. Is the server running?');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (newTodoText.trim() === '') return;

    try {
      const newTodo = await createTodo(newTodoText);
      setTodos([newTodo, ...todos]);
      setNewTodoText('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const handleToggle = async (id, currentCompleted) => {
    try {
      const updated = await updateTodo(id, { completed: !currentCompleted });
      setTodos(todos.map((todo) => (todo._id === id ? updated : todo)));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (loading) return <p>Loading todos...</p>;

  return (
    <div>
      <h1>Todo App</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo._id, todo.completed)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
