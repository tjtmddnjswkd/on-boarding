import React from 'react';
import { Link } from 'react-router-dom';

function Header({ isAuthenticated, onLogout }) {
  return (
    <header>
      <nav>
        <Link to="/">홈</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/register">회원가입</Link>
          </>
        ) : (
          <>
            <Link to="/new">글쓰기</Link>
            <button onClick={onLogout}>로그아웃</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
