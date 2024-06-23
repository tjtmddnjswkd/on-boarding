import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';
import Comment from './Comment';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/posts/${postId}/comments/`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the comments!", error);
      });
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(comments.map(comment => (comment.id === updatedComment.id ? updatedComment : comment)));
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(comments.filter(comment => comment.id !== deletedCommentId));
  };

  return (
    <div>
      <h3>Comments</h3>
      <CommentForm postId={postId} parentId={null} onCommentAdded={handleCommentAdded} />
      <ul>
        {comments.map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            onCommentUpdated={handleCommentUpdated} 
            onCommentDeleted={handleCommentDeleted} 
          />
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
