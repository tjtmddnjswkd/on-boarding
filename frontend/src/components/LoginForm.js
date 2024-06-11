import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
      username: username,
      password: password
    }))
      .then(response => {
        localStorage.setItem('token', response.data.access_token);
        onLogin();
        navigate('/');
      })
      .catch(error => {
        console.error("There was an error logging in!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      <div>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </form>
  );
}

export default LoginForm;
