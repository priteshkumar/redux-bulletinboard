import { useState } from "react";
import { useDispatch } from "react-redux";
//import { nanoid } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { selectPostById, updatePost, deletePost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useParams, useNavigate } from "react-router-dom";

function EditPostForm() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useSelector((state) => selectPostById(state, Number(postId)));

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(post?.userId);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  function handleTitleChanged(e) {
    setTitle(e.target.value);
  }

  function handleContentChanged(e) {
    setContent(e.target.value);
  }

  function handleUserChanged(e) {
    setUserId(e.target.value);
  }

  async function savePost() {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(
          updatePost({
            id: post.id,
            title,
            body: content,
            userId,
            reactions: post.reactions,
          })
        ).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.log("failed to edit the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  }

  async function handleDeletePost() {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(
          deletePost({
            id: post.id,
          })
        ).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
        navigate("/");
      } catch (err) {
        console.log("failed to delete the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  }

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a new post</h2>
      <form className="postform">
        <div className="formcontrol">
          <label htmlFor="postAuthor">Author:</label>
          <br />
          <select
            id="postAuthor"
            defaultValue={userId}
            onChange={handleUserChanged}
          >
            <option value=""></option>
            {userOptions}
          </select>
        </div>
        <div className="formcontrol">
          <label htmlFor="postTitle">Post title:</label>
          <br />
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            value={title}
            onChange={handleTitleChanged}
          />
        </div>

        <div className="formcontrol">
          <label htmlFor="postContent">Post content:</label>
          <br />
          <textarea
            id="postContent"
            name="postContent"
            value={content}
            onChange={handleContentChanged}
            rows="4"
            cols="50"
          />
        </div>
        <button type="button" onClick={savePost}>
          Save Post
        </button>
        <button type="button" onClick={handleDeletePost}>
          Delete Post
        </button>
      </form>
    </section>
  );
}

export default EditPostForm;
