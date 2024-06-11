import React from 'react';
import PostList from './PostList';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div>
      <h1>게시판</h1>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
      <PostList />
    </div>
  );
}

export default MainPage;
