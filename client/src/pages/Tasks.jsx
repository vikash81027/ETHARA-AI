import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [user, statusFilter]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks${statusFilter ? `?status=${statusFilter}` : ''}`);
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { title, description, project: projectId, assignedTo, dueDate });
      setShowForm(false);
      setTitle('');
      setDescription('');
      setProjectId('');
      setAssignedTo('');
      setDueDate('');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') return 'badge badge-completed';
    if (status === 'In Progress') return 'badge badge-progress';
    return 'badge badge-pending';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <div className="flex gap-4 items-center">
          <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {user?.role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'New Task'}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreate} style={{ marginTop: '1rem' }}>
            <div className="input-group">
              <label>Title</label>
              <input type="text" required className="input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Project</label>
              <select required className="input" value={projectId} onChange={e => setProjectId(e.target.value)}>
                <option value="">Select Project...</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Assign To</label>
              <select className="input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Due Date</label>
              <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.length === 0 ? <p>No tasks found.</p> : null}
        {tasks.map(task => (
          <div key={task._id} className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{task.title}</h3>
              <span className={getStatusBadge(task.status)}>{task.status}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{task.description}</p>
            <div className="flex justify-between items-center">
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <strong>Project:</strong> {task.project?.name} <br />
                <strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}
              </div>
              <div className="flex gap-2">
                <select 
                  className="input" 
                  value={task.status} 
                  onChange={e => updateStatus(task._id, e.target.value)}
                  style={{ width: '140px', padding: '0.25rem' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
