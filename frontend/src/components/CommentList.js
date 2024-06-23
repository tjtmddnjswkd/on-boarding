import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

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
          <Comment key={comment.id} comment={comment} onCommentUpdated={handleCommentUpdated} onCommentDeleted={handleCommentDeleted} />
        ))}
      </ul>
    </div>
  );
}

function Comment({ comment, onCommentUpdated, onCommentDeleted }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const token = localStorage.getItem('token');
  const userId = parseInt(localStorage.getItem('userId'));

  const handleReplyAdded = (newReply) => {
    if (comment.replies) {
      comment.replies.push(newReply);
    } else {
      comment.replies = [newReply];
    }
  };

  const handleEdit = () => {
    axios.put(`http://127.0.0.1:8000/comments/${comment.id}`, { content, post_id: comment.post_id, parent_id: comment.parent_id }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setIsEditing(false);
        onCommentUpdated(response.data);
      })
      .catch(error => {
        console.error("There was an error updating the comment!", error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/comments/${comment.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        onCommentDeleted(comment.id);
      })
      .catch(error => {
        console.error("There was an error deleting the comment!", error);
      });
  };

  return (
    <li>
      {isEditing ? (
        <>
          <textarea value={content} onChange={e => setContent(e.target.value)} />
          <button onClick={handleEdit}>Save</button>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          <p>by {comment.owner.username} on {new Date(comment.created_at).toLocaleString()}</p>
        </>
      )}
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      {userId === comment.owner.id && (
        <>
          <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      {showReplyForm && (
        <CommentForm postId={comment.post_id} parentId={comment.id} onCommentAdded={handleReplyAdded} />
      )}
      {comment.replies && (
        <ul>
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} onCommentUpdated={onCommentUpdated} onCommentDeleted={onCommentDeleted} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default CommentList;
