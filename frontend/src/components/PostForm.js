import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUserId(response.data.id);
        })
        .catch(error => {
          console.error("There was an error fetching the user!", error);
        });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { title, content };
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
        <label>제목</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label>내용</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button type="submit">저장</button>
    </form>
  );
}

export default PostForm;
