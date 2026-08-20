import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([
    { _id: '1', text: 'Learn React', completed: false },
    { _id: '2', text: 'Build a todo app', completed: true },
    { _id: '3', text: 'Deploy it', completed: false },
  ]);

  const [newTodoText, setNewTodoText] = useState('');

  const handleAdd = () => {
    if (newTodoText.trim() === '') return;

    const newTodo = {
      _id: Date.now().toString(),
      text: newTodoText,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setNewTodoText('');
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div>
      <h1>Todo App</h1>

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
              onChange={() => handleToggle(todo._id)}
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
