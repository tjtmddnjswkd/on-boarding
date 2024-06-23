import React, { useState } from 'react';
import axios from 'axios';

function CommentForm({ postId, parentId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/comments/', {
      content,
      post_id: postId,
      parent_id: parentId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setContent('');
        onCommentAdded(response.data);
      })
      .catch(error => {
        console.error("There was an error creating the comment!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button type="submit">작성</button>
    </form>
  );
}

export default CommentForm;
