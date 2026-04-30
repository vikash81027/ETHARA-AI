import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 1rem' }}>
          <h2 style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.5rem' }}>TeamTask</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Welcome, {user?.name}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/projects" className="nav-item">
            <FolderKanban size={20} /> Projects
          </Link>
          <Link to="/tasks" className="nav-item">
            <CheckSquare size={20} /> Tasks
          </Link>
          <button onClick={logout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', marginTop: 'auto' }}>
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Layout><Projects /></Layout></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
