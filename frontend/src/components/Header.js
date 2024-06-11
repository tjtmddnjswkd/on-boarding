import React from 'react';
import { Link } from 'react-router-dom';

function Header({ isAuthenticated, onLogout }) {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/new">글쓰기</Link>
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
