import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/posts/${id}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the post!", error);
      });
  }, [id]);

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:8000/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error("There was an error deleting the post!", error);
      });
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Link to={`/edit/${post.id}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default PostDetail;
