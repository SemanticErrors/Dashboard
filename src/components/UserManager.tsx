import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import "../styles/users.scss";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const UserManager: React.FC = () => {
  const { data, isLoading, isError } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div className="user-card">Loading users...</div>;
  if (isError) return <div className="user-card">Error fetching users.</div>;

  return (
    <div className="user-card">
      <h3>Users & Posts</h3>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            <Link to={`/dashboard/users/${user.id}`}>
              <strong>{user.name}</strong> <span>({user.username})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
