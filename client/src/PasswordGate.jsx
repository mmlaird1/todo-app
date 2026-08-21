import { useState } from 'react';
import { login, setAuthToken } from './api/todos';

function PasswordGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await login(passwordInput);
      setAuthToken(response.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setErrorMessage('Too many attempts. Try again in a few minutes.');
      } else {
        setErrorMessage('Access denied');
      }
      setShowError(true);
      setPasswordInput('');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(e) {
    setPasswordInput(e.target.value);
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
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Checking...' : 'Unlock'}
          </button>
        </form>
        {showError && <p className="access-denied">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default PasswordGate;
