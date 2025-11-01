import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import UsersList from './components/users/UsersList';
import AddUser from './components/users/AddUser';
import './App.css';

// A wrapper to handle protected routes
const ProtectedRoute = ({ children, user }) => {
  const location = useLocation();
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Main App component
const AppContent = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check both localStorage and sessionStorage for existing session
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.isAuthenticated ? user : null;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  });

  // Handle login - store in appropriate storage based on rememberMe
  const handleLogin = (userData, rememberMe = false) => {
    const user = { ...userData, isAuthenticated: true };
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    setCurrentUser(user);
  };

  // Handle logout - clear all storage
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setCurrentUser(null);
  };


  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={
          !currentUser ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute user={currentUser}>
            <div className="dashboard">
              <header className="app-header">
                <h1>Marketing Pro</h1>
                <div className="user-info">
                  <span>Welcome, {currentUser?.phone}</span>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              </header>
              <main className="main-content">
                <UsersList />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/add-user" element={
          <ProtectedRoute user={currentUser}>
            <div className="dashboard">
              <header className="app-header">
                <h1>Add New User</h1>
                <div className="user-info">
                  <span>{currentUser?.phone}</span>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              </header>
              <main className="main-content">
                <AddUser currentUser={currentUser} />
              </main>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="*" element={
          <div className="not-found">
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </div>
  );
};

// App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
