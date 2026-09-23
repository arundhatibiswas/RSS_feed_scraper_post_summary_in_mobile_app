import React, { useState } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

const EditModal = ({ article, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: article?.title || '',
        summary: article?.summary || '',
        imageUrl: article?.imageUrl || ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Edit Article</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Headline</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>AI Summary</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image URL</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <ImageIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                <input
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(article.id, formData)}>
                            <Save size={18} /> Save Changes
                        </button>
                        <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
