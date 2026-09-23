import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FileText,
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Edit3,
    ExternalLink
} from 'lucide-react';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/articles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(res.data);
        } catch (err) {
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PUBLISHED: { bg: '#f0fdf4', color: '#10b981', icon: <CheckCircle2 size={14} /> },
            APPROVED: { bg: '#eef2ff', color: '#3b82f6', icon: <CheckCircle2 size={14} /> },
            UNDER_REVIEW: { bg: '#fff7ed', color: '#f97316', icon: <Edit3 size={14} /> },
            PENDING: { bg: '#fffbeb', color: '#f59e0b', icon: <Clock size={14} /> },
            REJECTED: { bg: '#fef2f2', color: '#ef4444', icon: <XCircle size={14} /> },
        };
        const style = styles[status] || styles.PENDING;
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: style.bg,
                color: style.color,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {style.icon} {status}
            </span>
        );
    };

    return (
        <div className="articles-page">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem' }}>Articles Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage, edit and publish news content</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={20} /> New Article
                </button>
            </header>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ fontSize: '0.9rem' }}><Filter size={18} /> Filters</button>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Find an article..."
                                style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing {articles.length} articles</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ARTICLE</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>AUTHOR</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATS</th>
                                <th style={{ padding: '1rem 1.5rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : articles.map((article) => (
                                <tr key={article.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s', cursor: 'pointer' }} className="table-row">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {article.imageUrl ? (
                                                <img src={article.imageUrl} alt="" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '45px', height: '45px', borderRadius: '8px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} color="#94a3b8" /></div>
                                            )}
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{article.title}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated {new Date(article.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{article.category?.name || 'Uncategorized'}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{article.author?.name?.charAt(0) || 'U'}</div>
                                            <span style={{ fontSize: '0.9rem' }}>{article.author?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        {getStatusBadge(article.status)}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                                            <span><strong>{article.views}</strong> views</span>
                                            <span style={{ color: 'var(--text-muted)' }}>{article.clicks} clicks</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><MoreVertical size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
        .table-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
        </div>
    );
};

export default Articles;
