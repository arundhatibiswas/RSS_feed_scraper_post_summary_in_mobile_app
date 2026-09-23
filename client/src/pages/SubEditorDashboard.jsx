import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Zap,
    Check,
    X,
    Eye,
    Search,
    Filter,
    RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

const SubEditorDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const socket = useSocket();

    useEffect(() => {
        fetchQueue();

        if (socket) {
            socket.on('article_new', fetchQueue);
            return () => {
                socket.off('article_new', fetchQueue);
            };
        }
    }, [socket]);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Using the new requested endpoint pattern
            const res = await axios.get('/api/articles?status=UNDER_REVIEW', { headers });
            setQueue(res.data.map(a => ({ ...a, isEditing: false })));
        } catch (err) {
            console.error('Error fetching queue:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status, updatedData = {}) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/articles/${id}`, { status, ...updatedData }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQueue(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error(`Error updating article ${id}:`, err);
        }
    };

    const toggleEdit = (id) => {
        setQueue(prev => prev.map(a => a.id === id ? { ...a, isEditing: !a.isEditing } : a));
    };

    const updateField = (id, field, value) => {
        setQueue(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    return (
        <div className="sub-editor-dashboard">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap color="#f59e0b" fill="#f59e0b" size={28} /> AI News Queue
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Review and approve AI-generated news from n8n</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={async () => {
                            setRefreshing(true);
                            setMessage('');
                            try {
                                const token = localStorage.getItem('token');
                                await axios.post('/api/workflow/trigger', {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                setMessageType('success');
                                setMessage(`Check back in a moment for new articles!`);
                                // Refresh after a short delay to allow n8n to process
                                setTimeout(fetchQueue, 3000);
                            } catch (err) {
                                console.error('Webhook trigger failed:', err);
                                setMessageType('error');
                                setMessage('Error triggering workflow. Please try again.');
                            } finally {
                                setRefreshing(false);
                                setTimeout(() => setMessage(''), 5000);
                            }
                        }}
                        className="btn btn-outline"
                        style={{ display: 'flex', gap: '6px' }}
                        disabled={refreshing}
                    >
                        <RotateCw size={16} className={refreshing || loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </header>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '10px 15px',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        backgroundColor: messageType === 'success' ? '#dcfce7' : '#fee2e2',
                        color: messageType === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${messageType === 'success' ? '#bbf7d0' : '#fecaca'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    {messageType === 'success' ? <Check size={16} /> : <X size={16} />}
                    {message}
                </motion.div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input type="text" placeholder="Search news..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
                </div>
                <div className="card" style={{ width: '200px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}><Filter size={16} /> Status</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>UNDER REVIEW ({queue.length})</span>
                </div>
            </div>

            <div className="queue-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence>
                    {queue.map((article) => (
                        <motion.div
                            key={article.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            className="card"
                            style={{ overflow: 'hidden', padding: 0 }}
                        >
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img
                                    src={article.imageUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500`}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500'; }}
                                />
                                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                                    {article.category?.name || 'AI Summary'}
                                </div>
                                {article.isEditing && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'rgba(0,0,0,0.7)' }}>
                                        <input
                                            type="text"
                                            value={article.imageUrl || ''}
                                            onChange={(e) => updateField(article.id, 'imageUrl', e.target.value)}
                                            placeholder="Paste Image URL here..."
                                            style={{ width: '100%', padding: '5px', borderRadius: '4px', border: 'none', fontSize: '12px' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1.25rem' }}>
                                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px', lineHeight: 1.4 }}>{article.title}</h4>
                                {article.isEditing ? (
                                    <textarea
                                        value={article.summary || ''}
                                        onChange={(e) => updateField(article.id, 'summary', e.target.value)}
                                        style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', marginBottom: '1rem', resize: 'none' }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {article.summary || 'No summary provided.'}
                                    </p>
                                )}


                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handleAction(article.id, 'APPROVED', { summary: article.summary, imageUrl: article.imageUrl })}
                                        className="btn"
                                        style={{ flex: 1, backgroundColor: '#dcfce7', color: '#166534', justifyContent: 'center' }}
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(article.id, 'REJECTED')}
                                        className="btn"
                                        style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px' }}
                                    >
                                        <X size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleEdit(article.id)}
                                        className={`btn ${article.isEditing ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ padding: '10px' }}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {queue.length === 0 && !loading && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', backgroundColor: 'white', borderRadius: '12px', border: '2px dashed var(--border)' }}>
                        <Zap size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#94a3b8' }}>Queue is empty!</h3>
                        <p style={{ color: '#cbd5e1' }}>You've processed all pending articles.</p>
                    </div>
                )}
            </div>

            <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default SubEditorDashboard;
