import React from 'react';
import { Check, Send, Edit3, Trash2 } from 'lucide-react';

const SummaryCard = ({ article, onApprove, onPost, onEdit, showApprove, showPost }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden' }}>
                <img
                    src={article.imageUrl || 'https://via.placeholder.com/400x225?text=No+Image'}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)'
                }}>
                    {article.category?.name || 'News'}
                </div>
            </div>

            <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', fontWeight: 600, lineHeight: 1.4 }}>{article.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.summary || article.content}
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                {showApprove && (
                    <button
                        onClick={() => onApprove(article.id)}
                        className="btn"
                        style={{ flex: 1, backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem', padding: '6px' }}
                        title="Approve"
                    >
                        <Check size={16} /> Approve
                    </button>
                )}
                {showPost && (
                    <button
                        onClick={() => onPost(article.id)}
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}
                        title="Post to Live"
                    >
                        <Send size={16} /> Post
                    </button>
                )}
                <button
                    onClick={() => onEdit(article)}
                    className="btn btn-outline"
                    style={{ padding: '6px' }}
                    title="Edit Details"
                >
                    <Edit3 size={16} />
                </button>
            </div>
        </div>
    );
};

export default SummaryCard;
