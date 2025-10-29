import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserDetail from "./pages/UserDetail";
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
  
      <Route path="/" element={<Navigate to="/login" replace />} />

    
      <Route path="/login" element={<Login />} />

  
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />

 
      <Route
        path="/dashboard/users/:id"
        element={
          isAuthenticated ? <UserDetail /> : <Navigate to="/login" replace />
        }
      />

 
      <Route path="*" element={<div>404 - Not found</div>} />
    </Routes>
  );
};

export default App;
