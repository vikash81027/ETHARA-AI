import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks');
        const now = new Date();
        
        const total = data.length;
        const completed = data.filter(t => t.status === 'Completed').length;
        const pending = data.filter(t => t.status !== 'Completed').length;
        const overdue = data.filter(t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now).length;
        
        setStats({ total, completed, pending, overdue });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Overdue</h3>
            <p>{stats.overdue}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Welcome to Team Task Manager!</h3>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Manage your projects efficiently. {user?.role === 'Admin' ? 'As an admin, you can create projects, assign members, and manage tasks.' : 'View your assigned projects and update task statuses as you progress.'}
        </p>
      </div>
    </div>
  );
}
