import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') fetchUsers();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      await api.post('/projects', { name, description, members: selectedMembers });
      setShowForm(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate} style={{ marginTop: '1rem' }}>
            <div className="input-group">
              <label>Name</label>
              <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="input" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <div className="input-group">
              <label>Members</label>
              <select multiple className="input" value={selectedMembers} onChange={e => setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))}>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <small style={{ color: 'var(--text-secondary)' }}>Hold Ctrl/Cmd to select multiple</small>
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.length === 0 ? <p>No projects found.</p> : null}
        {projects.map(project => (
          <div key={project._id} className="card flex justify-between items-center">
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{project.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{project.description}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                <strong>Members: </strong>
                {project.members?.map(m => m.name).join(', ') || 'None'}
              </div>
            </div>
            {user?.role === 'Admin' && (
              <button className="btn btn-danger" onClick={() => handleDelete(project._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
