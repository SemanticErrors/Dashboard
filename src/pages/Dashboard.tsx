import React from "react";
import { useAuth } from "../contexts/AuthContext";
import NoteManager from "../components/NoteManager";
import UserManager from "../components/UserManager";
import SimpleAnalytics from "../components/SimpleAnalytics";
import WeatherCard from "../components/WeatherCard";
import "../styles/dashboard.scss";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="dashboard-grid">
   
        <section className="card">
          <UserManager />
        </section>

    
        <section className="card note-card-wide">
          <NoteManager />
        </section>

   
        <section className="card">
          <SimpleAnalytics />
        </section>

        <section className="card">
          <WeatherCard />
        </section>
      </main>

    </div>
  );
};

export default Dashboard;
