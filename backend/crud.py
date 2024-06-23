from sqlalchemy.orm import Session
from abc import ABC, abstractmethod
import models, schemas
from passlib.context import CryptContext


class CRUDInterface(ABC):
    @abstractmethod
    def get(self, db: Session, id: int):
        pass

    @abstractmethod
    def create(self, db: Session, obj_in):
        pass

    @abstractmethod
    def update(self, db: Session, db_obj, obj_in):
        pass

    @abstractmethod
    def delete(self, db: Session, id: int):
        pass


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CRUDUser(CRUDInterface):
    def get(self, db: Session, id: int):
        return db.query(models.User).filter(models.User.id == id).first()

    def get_by_username(self, db: Session, username: str):
        return db.query(models.User).filter(models.User.username == username).first()

    def create(self, db: Session, obj_in: schemas.User):
        hashed_password = pwd_context.hash(obj_in.password)
        db_user = models.User(username=obj_in.username, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update(self, db: Session, db_obj: models.User, obj_in: schemas.User):
        db_obj.username = obj_in.username
        if obj_in.password:
            db_obj.hashed_password = pwd_context.hash(obj_in.password)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: int):
        db_user = db.query(models.User).filter(models.User.id == id).first()
        db.delete(db_user)
        db.commit()
        return db_user


class CRUDPost(CRUDInterface):
    def get(self, db: Session, id: int):
        return db.query(models.Post).filter(models.Post.id == id).first()

    def create(self, db: Session, obj_in: schemas.PostCreate, user_id: int):
        db_post = models.Post(**obj_in.dict(), owner_id=user_id)
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post

    def update(self, db: Session, db_obj: models.Post, obj_in: schemas.PostCreate):
        db_obj.title = obj_in.title
        db_obj.content = obj_in.content
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: int):
        db_post = db.query(models.Post).filter(models.Post.id == id).first()
        db.delete(db_post)
        db.commit()
        return db_post


class CRUDComment(CRUDInterface):
    def get(self, db: Session, id: int):
        return db.query(models.Comment).filter(models.Comment.id == id).first()

    def create(self, db: Session, obj_in: schemas.CommentCreate, user_id: int):
        db_comment = models.Comment(**obj_in.dict(), owner_id=user_id)
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment

    def update(
        self, db: Session, db_obj: models.Comment, obj_in: schemas.CommentCreate
    ):
        db_obj.content = obj_in.content
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: int):
        db_comment = db.query(models.Comment).filter(models.Comment.id == id).first()
        if db_comment.replies and len(db_comment.replies) > 0:
            raise HTTPException(
                status_code=400, detail="댓글에 대댓글이 있어 삭제할 수 없습니다."
            )
        db.delete(db_comment)
        db.commit()
        return db_comment

    def get_by_post(self, db: Session, post_id: int):
        return (
            db.query(models.Comment)
            .filter(models.Comment.post_id == post_id, models.Comment.parent_id == None)
            .all()
        )
