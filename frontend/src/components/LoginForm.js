import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');  // 기존 오류 메시지 초기화
    axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
      username: username,
      password: password
    }))
      .then(response => {
        localStorage.setItem('token', response.data.access_token);
        // 사용자 정보를 가져와서 로컬 스토리지에 저장
        axios.get('http://127.0.0.1:8000/users/me', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`
          }
        }).then(userResponse => {
          localStorage.setItem('userId', userResponse.data.id);
          onLogin();
          navigate('/');
        }).catch(userError => {
          console.error("사용자를 가져오는 중에 오류가 발생했습니다.", userError);
        });
      })
      .catch(error => {
        setError('아이디 또는 비밀번호가 틀렸습니다.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>아이디</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <label>비밀번호</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">로그인</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <p>회원이 아니신가요? <Link to="/register">회원가입</Link></p>
      </div>
    </form>
  );
}

export default LoginForm;
