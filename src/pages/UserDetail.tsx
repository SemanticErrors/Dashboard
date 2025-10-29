import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "../styles/userDetail.scss";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
};

type Post = {
  id: number;
  title: string;
  body: string;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const fetchUser = async (id: string) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  return res.json();
};

const fetchPosts = async (id: string) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}/posts`
  );
  return res.json();
};

const fetchTodos = async (id: string) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}/todos`
  );
  return res.json();
};

const TODOS_KEY = "user_todos_state";

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [todosState, setTodosState] = useState<Record<number, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(TODOS_KEY) || "{}");
    } catch {
      return {};
    }
  });

  const saveTodosState = (state: Record<number, boolean>) => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(state));
  };

  const userQuery = useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  });

  const postsQuery = useQuery<Post[], Error>({
    queryKey: ["posts", id],
    queryFn: () => fetchPosts(id!),
    enabled: !!id,
  });

  const todosQuery = useQuery<Todo[], Error>({
    queryKey: ["todos", id],
    queryFn: () => fetchTodos(id!),
    enabled: !!id,
  });

  const toggleTodo = (todoId: number) => {
  setTodosState((prev) => {
    const updated = { ...prev, [todoId]: !prev[todoId] };
    saveTodosState(updated);

    try {
      window.dispatchEvent(new CustomEvent("todos-updated", { detail: updated }));
    } catch {
   
      window.dispatchEvent(new Event("todos-updated"));
    }

    return updated;
  });
};

  if (userQuery.isLoading) return <div>Loading user...</div>;
  if (userQuery.isError) return <div>Error loading user</div>;

  const user = userQuery.data!;

  return (
    <div className="user-detail">
      <Link to="/dashboard">← Back</Link>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>

      <hr />

      <h3>Posts</h3>
      {postsQuery.isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {postsQuery.data?.map((post: Post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h3>To-dos</h3>
      {todosQuery.isLoading ? (
        <p>Loading todos...</p>
      ) : (
        <ul>
          {todosQuery.data?.map((todo: Todo) => {
            const done = todosState[todo.id] ?? todo.completed;
            return (
              <li
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className={done ? "todo-completed" : ""}
              >
                {todo.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserDetail;
