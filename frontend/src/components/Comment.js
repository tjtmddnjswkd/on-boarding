import React, { useState } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

function Comment({ comment, onCommentUpdated, onCommentDeleted }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const token = localStorage.getItem('token');
  const userId = parseInt(localStorage.getItem('userId'));

  const handleReplyAdded = (newReply) => {
    onCommentUpdated({
      ...comment,
      replies: [...comment.replies, newReply]
    });
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
    if (comment.replies && comment.replies.length > 0) {
      alert("댓글에 대댓글이 있어 삭제할 수 없습니다.");
      return;
    }

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
          <button onClick={handleEdit}>저장</button>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          <p>by {comment.owner.username} on {new Date(comment.created_at).toLocaleString()}</p>
        </>
      )}
      {token && comment.parent_id === null && <button onClick={() => setShowReplyForm(!showReplyForm)}>댓글</button>}
      {token && userId === comment.owner.id && (
        <>
          <button onClick={() => setIsEditing(!isEditing)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </>
      )}
      {showReplyForm && (
        <CommentForm postId={comment.post_id} parentId={comment.id} onCommentAdded={handleReplyAdded} />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul>
          {comment.replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              onCommentUpdated={onCommentUpdated} 
              onCommentDeleted={onCommentDeleted} 
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default Comment;
