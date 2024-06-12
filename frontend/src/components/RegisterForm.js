import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // 에러 메시지 상태 추가
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // 에러 메시지 초기화
    axios.post('http://127.0.0.1:8000/users/', { username, password })
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setError('이미 존재하는 아이디입니다');
        } else {
          console.error("There was an error creating the account!", error);
        }
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
      {error && <p className="error">{error}</p>} {/* 에러 메시지 표시 */}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
