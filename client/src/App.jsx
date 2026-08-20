import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingIds, setPendingIds] = useState(new Set());

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
      const message = err.response?.data?.error || 'Failed to add todo. Please try again.';
      setError(message);
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
  };

  if (loading) {
    return (
      <div className="app">
        <p className="loading">Loading todos...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Todos</h1>
        <p className="app-subtitle">
          {todos.length === 0
            ? 'Nothing to do yet.'
            : `${todos.filter((t) => !t.completed).length} remaining`}
        </p>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="error-dismiss" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="add-form">
        <input
          type="text"
          className="add-input"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={isAdding || newTodoText.trim() === ''}
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">
            No todos yet. Add one above to get started.
          </p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => {
            const isPending = pendingIds.has(todo._id);
            return (
              <li
                key={todo._id}
                className={`todo-item ${isPending ? 'is-pending' : ''}`}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo._id, todo.completed)}
                  disabled={isPending}
                />
                <span
                  className={`todo-text ${todo.completed ? 'is-completed' : ''}`}
                >
                  {todo.text}
                </span>
                <button
                  className="todo-delete"
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
