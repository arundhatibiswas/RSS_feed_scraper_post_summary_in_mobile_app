import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FileText,
    Clock,
    Users,
    Flame,
    TrendingUp,
    RotateCw
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import SummaryCard from '../components/SummaryCard';
import EditModal from '../components/EditModal';
import { useSocket } from '../context/SocketContext';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [approvedArticles, setApprovedArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsRes, articlesRes] = await Promise.all([
                axios.get('/api/stats', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/articles', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStats(statsRes.data);
            // Admin sees articles approved by Editor (status: APPROVED)
            setApprovedArticles(articlesRes.data.filter(a => a.status === 'APPROVED'));
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        if (socket) {
            socket.on('stats_update', fetchData);
            socket.on('article_new', fetchData);
            socket.on('article_updated', fetchData);

            socket.on('traffic_update', (data) => {
                setStats(prev => {
                    if (!prev) return prev;
                    const newData = [...prev.trafficData.slice(1), { name: 'Live', views: data.views, clicks: Math.floor(data.views / 3) }];
                    return { ...prev, trafficData: newData };
                });
            });

            return () => {
                socket.off('stats_update', fetchData);
                socket.off('article_new', fetchData);
                socket.off('article_updated', fetchData);
                socket.off('traffic_update');
            };
        }
    }, [socket]);

    const handlePost = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/articles/${id}`, { status: 'PUBLISHED' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // data refresh triggered by socket
        } catch (err) { alert('Error posting article'); }
    };

    const handleEditSave = async (id, data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/articles/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingArticle(null);
            // data refresh triggered by socket
        } catch (err) { alert('Error updating article'); }
    };

    if (!stats) return <div style={{ padding: '2rem' }}>Loading Admin Dashboard...</div>;

    const statCards = [
        { label: 'Total Articles', value: stats.totalArticles, icon: <FileText color="#3b82f6" />, change: '+12%', bgColor: '#eef2ff' },
        { label: 'Pending Approval', value: stats.pendingApproval, icon: <Clock color="#f59e0b" />, change: 'Action Required', bgColor: '#fffbeb' },
        { label: 'Active Users', value: stats.activeUsers, icon: <Users color="#10b981" />, change: '+2 new', bgColor: '#f0fdf4' },
        { label: 'Breaking News', value: stats.breakingNews, icon: <Flame color="#ef4444" />, change: 'Hot', bgColor: '#fef2f2' },
    ];

    return (
        <div className="dashboard-page">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Admin Overview</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time newsroom performance</p>
                </div>
                {/* <button onClick={fetchData} className="btn btn-outline"><RotateCw size={18} /> Refresh</button> */}
            </header>

            <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
                {statCards.map((stat, i) => (
                    <div key={i} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '1.8rem', margin: '5px 0' }}>{stat.value}</h3>
                            </div>
                            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: stat.bgColor }}>{stat.icon}</div>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                            <TrendingUp size={14} /> {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Traffic Overview (Real-time)</h3>
                <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.trafficData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#colorViews)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>Freshly Approved by Editor</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ready for final publishing</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {approvedArticles.map(article => (
                        <SummaryCard
                            key={article.id}
                            article={article}
                            showPost={true}
                            onPost={handlePost}
                            onEdit={(a) => setEditingArticle(a)}
                        />
                    ))}
                    {approvedArticles.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                            No articles waiting for post.
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

export default Dashboard;
