import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);

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
    if (post.owner.id !== userId) {
      alert("본인 글이 아니면 삭제가 불가능합니다.");
      return;
    }
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
      <p>by {post.owner.username} on {new Date(post.created_at).toLocaleString()}</p>
      {post.owner.id === userId && (
        <>
          <Link to={`/edit/${post.id}`}>수정</Link>
          <button onClick={handleDelete}>삭제</button>
        </>
      )}
    </div>
  );
}

export default PostDetail;
