import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/posts/${id}`)
        .then(response => {
          setTitle(response.data.title);
          setContent(response.data.content);
        })
        .catch(error => {
          console.error("There was an error fetching the post!", error);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { title, content };
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    if (id) {
      axios.put(`http://127.0.0.1:8000/posts/${id}`, data, { headers })
        .then(() => {
          navigate(`/posts/${id}`);
        })
        .catch(error => {
          console.error("There was an error updating the post!", error);
        });
    } else {
      axios.post('http://127.0.0.1:8000/posts/', data, { headers })
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error("There was an error creating the post!", error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Content</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}

export default PostForm;
