import { useState } from 'react';

const CORRECT_PASSWORD = 'MMLToDoList2026';

function PasswordGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showError, setShowError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordInput === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setShowError(true);
      setPasswordInput('');
    }
  }

  function handleChange(e) {
    setPasswordInput(e.target.value);
    // Clear the error message as soon as they start retyping
    if (showError) setShowError(false);
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="password-gate">
      <div className="password-card">
        <h1>Todo App</h1>
        <p>Enter password to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={passwordInput}
            onChange={handleChange}
            placeholder="Password"
            autoFocus
          />
          <button type="submit">Unlock</button>
        </form>
        {showError && <p className="access-denied">Access denied</p>}
      </div>
    </div>
  );
}

export default PasswordGate;
