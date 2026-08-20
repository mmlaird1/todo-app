import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingIds, setPendingIds] = useState(new Set());

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

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (!error) return;
    const timeoutId = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timeoutId);
  }, [error]);

  const handleAdd = async () => {
    const text = newTodoText.trim();
    if (text === '' || isAdding) return;

    setIsAdding(true);
    try {
      const newTodo = await createTodo(text);
      setTodos([newTodo, ...todos]);
      setNewTodoText('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleToggle = async (id, currentCompleted) => {
    if (pendingIds.has(id)) return;

    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const updated = await updateTodo(id, { completed: !currentCompleted });
      setTodos(todos.map((todo) => (todo._id === id ? updated : todo)));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id) => {
    if (pendingIds.has(id)) return;

    setPendingIds((prev) => new Set(prev).add(id));
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    // Note: on success, the item is removed from todos, so no need to clean up pendingIds
  };

  if (loading) return <p>Loading todos...</p>;

  return (
    <div>
      <h1>Todo App</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: '0.5rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
        <button onClick={handleAdd} disabled={isAdding || newTodoText.trim() === ''}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>

      {todos.length === 0 ? (
        <p style={{ color: '#666', marginTop: '1rem' }}>
          No todos yet. Add one above to get started.
        </p>
      ) : (
        <ul>
          {todos.map((todo) => {
            const isPending = pendingIds.has(todo._id);
            return (
              <li key={todo._id} style={{ opacity: isPending ? 0.5 : 1 }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo._id, todo.completed)}
                  disabled={isPending}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDelete(todo._id)}
                  disabled={isPending}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
