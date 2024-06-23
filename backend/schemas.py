from pydantic import BaseModel
from typing import List, Optional, ForwardRef
from datetime import datetime


# User Schema
class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


# Post Schema
class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    pass


class Post(PostBase):
    id: int
    owner_id: int
    owner: User
    created_at: datetime

    class Config:
        orm_mode = True


# Comment Schema
class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    post_id: int
    parent_id: Optional[int] = None


Comment = ForwardRef("Comment")


class Comment(CommentBase):
    id: int
    owner_id: int
    post_id: int
    parent_id: Optional[int]
    created_at: datetime
    owner: User
    replies: List[Comment] = []

    class Config:
        orm_mode = True


# Forward reference 해결
Comment.update_forward_refs()


# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str
