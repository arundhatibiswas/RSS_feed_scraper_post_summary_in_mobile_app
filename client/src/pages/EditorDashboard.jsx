import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Edit3,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    RotateCw
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import EditModal from '../components/EditModal';
import { useSocket } from '../context/SocketContext';

const EditorDashboard = () => {
    const [currentMonth] = useState('January');
    const [subApprovedArticles, setSubApprovedArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const [stats, setStats] = useState([
        { label: 'Assigned to Me', value: 0, icon: <Edit3 color="#3b82f6" /> },
        { label: 'Pending Reviews', value: 0, icon: <Clock color="#f59e0b" /> },
        { label: 'Published Today', value: 0, icon: <CheckCircle color="#10b981" /> },
        { label: 'Breaking Requests', value: 0, icon: <AlertCircle color="#ef4444" /> },
    ]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/articles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Editor sees articles approved by Sub-Editor (status: APPROVED)
            const articles = res.data;
            setSubApprovedArticles(articles.filter(a => a.status === 'APPROVED'));

            // Calculate Stats (Simulated based on available data)
            const pending = articles.filter(a => a.status === 'APPROVED').length;
            const published = articles.filter(a => a.status === 'PUBLISHED').length;

            setStats([
                { label: 'Assigned to Me', value: articles.length, icon: <Edit3 color="#3b82f6" /> },
                { label: 'Pending Reviews', value: pending, icon: <Clock color="#f59e0b" /> },
                { label: 'Published Total', value: published, icon: <CheckCircle color="#10b981" /> },
                { label: 'Breaking Requests', value: articles.filter(a => a.isBreaking).length, icon: <AlertCircle color="#ef4444" /> },
            ]);

        } catch (err) {
            console.error('Error fetching editor data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        if (socket) {
            socket.on('article_new', fetchData);
            socket.on('article_updated', fetchData);
            socket.on('stats_update', fetchData);

            return () => {
                socket.off('article_new', fetchData);
                socket.off('article_updated', fetchData);
                socket.off('stats_update', fetchData);
            };
        }
    }, [socket]);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/articles/${id}`, { status: 'PUBLISHED' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // fetchData(); // Socket will trigger update
        } catch (err) { alert('Error approving article'); }
    };

    const handleEditSave = async (id, data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/articles/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingArticle(null);
            // fetchData(); // Socket will trigger update
        } catch (err) { alert('Error updating article'); }
    };

    const days = Array.from({ length: 35 }, (_, i) => ({
        day: i + 15,
        items: i === 6 ? [{ type: 'published', count: 3 }, { type: 'pending', count: 2 }] : i === 7 ? [{ type: 'scheduled', count: 5 }] : []
    }));

    return (
        <div className="editor-dashboard">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Editor Workspace</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Review and finalise sub-editor approvals</p>
                </div>
                {/* Refresh is now automatic <button onClick={fetchData} className="btn btn-outline"><RotateCw size={18} /> Refresh</button> */}
            </header>

            <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card" style={{ position: 'relative' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '2rem', marginTop: '5px' }}>{stat.value}</h3>
                        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>{stat.icon}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CalendarIcon size={20} color="var(--primary)" /><h3 style={{ fontSize: '1.1rem' }}>Editorial Calendar</h3></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 600 }}>{currentMonth} 2026</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn-icon"><ChevronLeft size={18} /></button><button className="btn-icon"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>
                <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (<div key={day} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc', fontWeight: 600, fontSize: '0.8rem' }}>{day}</div>))}
                    {days.map((d, i) => (
                        <div key={i} style={{ height: '80px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5px', backgroundColor: d.day === 21 ? '#f0f7ff' : 'white' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: d.day > 31 ? '#cbd5e1' : '#64748b' }}>{d.day > 31 ? d.day - 31 : d.day}</span>
                            <div style={{ marginTop: '5px' }}>{d.items.map((item, idx) => (<div key={idx} style={{ fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px', marginBottom: '2px', backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700 }}>{item.count} {item.type}</div>))}</div>
                        </div>
                    ))}
                </div>
            </div>

            <section>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>Freshly Approved by Sub-Editor</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verify information before final approval</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {subApprovedArticles.map(article => (
                        <SummaryCard
                            key={article.id}
                            article={article}
                            showApprove={true}
                            onApprove={handleApprove}
                            onEdit={(a) => setEditingArticle(a)}
                        />
                    ))}
                    {subApprovedArticles.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                            No articles from sub-editors ready for review.
                        </div>
                    )}
                </div>
            </section>

            {editingArticle && (
                <EditModal
                    article={editingArticle}
                    isOpen={!!editingArticle}
                    onClose={() => setEditingArticle(null)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
};

export default EditorDashboard;
