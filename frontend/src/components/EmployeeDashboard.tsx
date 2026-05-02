import { useState, useEffect } from 'react';
import TaskManagement from './TaskManagement';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

interface EmployeeDashboardProps {
  token: string;
  currentUser: User;
  onLogout: () => void;
}

export default function EmployeeDashboard({ token, currentUser, onLogout }: EmployeeDashboardProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/logo.png" alt="Decode Age" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Employee Dashboard</h1>
            <p style={styles.welcome}>
              Welcome, {currentUser.name}
            </p>
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Profile</h2>
          <div style={styles.profileInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Name:</span>
              <span style={styles.value}>{currentUser.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{currentUser.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Role:</span>
              <span style={styles.value}>{currentUser.role}</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Tasks</h2>
          <TaskManagement token={token} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    height: '50px',
    width: 'auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  welcome: {
    color: '#666',
    margin: 0,
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    display: 'grid',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
    minWidth: '80px',
  },
  value: {
    color: '#333',
  },
  placeholder: {
    color: '#999',
    fontStyle: 'italic',
  },
};
