import React from 'react';
import { Search, Bell, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const Header = ({ user, onToggleSidebar, sidebarCollapsed }) => {
    return (
        <header style={{
            height: '70px',
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={onToggleSidebar}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {sidebarCollapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
                </button>

                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '10px 15px', borderRadius: '10px', width: '350px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search articles, users..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                </div>
            </div>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Bell size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: 'var(--danger)',
                        color: 'white',
                        fontSize: '10px',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>3</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
