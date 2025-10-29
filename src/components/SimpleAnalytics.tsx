
import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type User = { id: number; name: string; username: string; email: string };
type Post = { id: number; userId: number; title: string };
type Todo = { id: number; userId: number; title: string; completed: boolean };

const TODOS_KEY = "user_todos_state";

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
};

const SmallStatBox: React.FC<{ title: string; value: string | number; hint?: string }> = ({ title, value, hint }) => (
  <div className="stat-box">
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
    {hint && <div className="stat-hint">{hint}</div>}
  </div>
);

const readTodoOverrides = (): Record<number, boolean> => {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, boolean>;
  } catch {
    return {};
  }
};

const SimpleAnalytics: React.FC = () => {
  const usersQ = useQuery<User[], Error>({ queryKey: ["sa-users"], queryFn: fetchUsers });
  const postsQ = useQuery<Post[], Error>({ queryKey: ["sa-posts"], queryFn: fetchPosts });
  const todosQ = useQuery<Todo[], Error>({ queryKey: ["sa-todos"], queryFn: fetchTodos });

  const [overrides, setOverrides] = useState<Record<number, boolean>>(() => readTodoOverrides());

  
  useEffect(() => {
    const onCustom = (e: Event) => {

      const ce = e as CustomEvent;
      if (ce?.detail && typeof ce.detail === "object") {
        setOverrides(ce.detail as Record<number, boolean>);
      } else {
        setOverrides(readTodoOverrides());
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === TODOS_KEY) {
        setOverrides(readTodoOverrides());
      }
    };

    window.addEventListener("todos-updated", onCustom as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("todos-updated", onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const loading = usersQ.isLoading || postsQ.isLoading || todosQ.isLoading;
  const error = usersQ.isError || postsQ.isError || todosQ.isError;

  const stats = useMemo(() => {
    if (!usersQ.data || !postsQ.data || !todosQ.data) return null;

   
    const postsByUser = new Map<number, number>();
    for (const p of postsQ.data) postsByUser.set(p.userId, (postsByUser.get(p.userId) || 0) + 1);

    
    const completedTodosByUser = new Map<number, number>();
    for (const t of todosQ.data) {
     
      const overridden = overrides[t.id];
      const isCompleted = typeof overridden === "boolean" ? overridden : t.completed;

      if (isCompleted) {
        completedTodosByUser.set(t.userId, (completedTodosByUser.get(t.userId) || 0) + 1);
      }
    }

  
    for (const u of usersQ.data) {
      if (!postsByUser.has(u.id)) postsByUser.set(u.id, 0);
      if (!completedTodosByUser.has(u.id)) completedTodosByUser.set(u.id, 0);
    }

    const userWithExtreme = (map: Map<number, number>, findMax = true) => {
      let bestId: number | null = null;
      let bestVal = findMax ? -Infinity : Infinity;
      for (const [id, val] of map) {
        if (findMax ? val > bestVal : val < bestVal) {
          bestVal = val;
          bestId = id;
        }
      }
      if (bestId == null) return null;
      const user = usersQ.data!.find((u) => u.id === bestId);
      return { user, count: bestVal };
    };

    const mostPosts = userWithExtreme(postsByUser, true);
    const fewestPosts = userWithExtreme(postsByUser, false);
    const mostCompletedTodos = userWithExtreme(completedTodosByUser, true);
    const fewestCompletedTodos = userWithExtreme(completedTodosByUser, false);

    return {
      totalUsers: usersQ.data.length,
      mostPosts,
      fewestPosts,
      mostCompletedTodos,
      fewestCompletedTodos,
    };
  }, [usersQ.data, postsQ.data, todosQ.data, overrides]);

  if (loading) return <div>Loading analytics...</div>;
  if (error || !stats) return <div>Error loading analytics.</div>;

  return (
    <div>
      <h3>Simple Analytics</h3>

      <div className="analytics-grid" style={{ marginTop: 12 }}>
        <SmallStatBox title="Total users" value={stats.totalUsers} />

        <SmallStatBox
          title="Most posts"
          value={stats.mostPosts?.user ? `${stats.mostPosts.user.username} (${stats.mostPosts.count})` : "—"}
        />

        <SmallStatBox
          title="Fewest posts"
          value={stats.fewestPosts?.user ? `${stats.fewestPosts.user.username} (${stats.fewestPosts.count})` : "—"}
        />

        <SmallStatBox
          title="Most completed todos"
          value={stats.mostCompletedTodos?.user ? `${stats.mostCompletedTodos.user.username} (${stats.mostCompletedTodos.count})` : "—"}
        />

        <SmallStatBox
          title="Fewest completed todos"
          value={stats.fewestCompletedTodos?.user ? `${stats.fewestCompletedTodos.user.username} (${stats.fewestCompletedTodos.count})` : "—"}
        />
      </div>
    </div>
  );
};

export default SimpleAnalytics;
