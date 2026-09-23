import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users as UsersIcon,
    Plus,
    Trash2,
    Shield,
    Mail,
    User,
    Lock
} from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EDITOR' // Default
    });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers([...users, res.data]);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'EDITOR' });
        } catch (err) {
            alert(err.response?.data?.error || 'Error adding user');
        }
    };

    return (
        <div className="users-page">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>User Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage editors, sub-editors and admins</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    <Plus size={18} /> Add User
                </button>
            </header>

            <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>NAME</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>EMAIL</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ROLE</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <User size={16} />
                                    </div>
                                    {user.name}
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        backgroundColor: user.role === 'ADMIN' ? '#dbeafe' : user.role === 'EDITOR' ? '#dcfce7' : '#fff7ed',
                                        color: user.role === 'ADMIN' ? '#1e40af' : user.role === 'EDITOR' ? '#166534' : '#9a3412'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {user.role !== 'ADMIN' && (
                                        <button onClick={() => handleDelete(user.id)} className="btn-icon" style={{ color: '#ef4444' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Add New User</h3>
                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        required
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        placeholder="john@news.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        required
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        placeholder="********"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Role</label>
                                <div style={{ position: 'relative' }}>
                                    <Shield size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <select
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="EDITOR">Editor</option>
                                        <option value="SUB_EDITOR">Sub-Editor</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
