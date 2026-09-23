import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Clock,
    Users,
    Tag,
    Flame,
    Zap,
    Edit3,
    Image as ImageIcon,
    DollarSign,
    BarChart3,
    LogOut
} from 'lucide-react';

const Sidebar = ({ user, onLogout, collapsed }) => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Admin Dash', path: '/', roles: ['ADMIN'] },
        { icon: <Edit3 size={20} />, label: 'Editor Dash', path: '/editor', roles: ['EDITOR'] },
        { icon: <Zap size={20} />, label: 'Sub-Editor Dash', path: '/sub-editor', roles: ['SUB_EDITOR'] },
        { icon: <FileText size={20} />, label: 'All Articles', path: '/articles', roles: ['ADMIN', 'EDITOR', 'SUB_EDITOR'] },
        { icon: <Clock size={20} />, label: 'Pending Approval', path: '/pending', roles: ['ADMIN', 'EDITOR', 'SUB_EDITOR'] },
        { icon: <Users size={20} />, label: 'Users', path: '/users', roles: ['ADMIN'] },
        { icon: <Tag size={20} />, label: 'Categories', path: '/categories', roles: ['ADMIN', 'EDITOR', 'SUB_EDITOR'] },
    ].filter(item => item.roles.includes(user.role));

    return (
        <aside className="sidebar" style={{
            width: collapsed ? '80px' : '260px',
            backgroundColor: 'var(--sidebar-bg)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 0',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }}>
            <div className="logo" style={{
                padding: collapsed ? '0 0.5rem 2rem' : '0 1.5rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '1rem',
                textAlign: collapsed ? 'center' : 'left'
            }}>
                <h1 style={{
                    fontSize: collapsed ? '1.2rem' : '1.5rem',
                    letterSpacing: '1px',
                    transition: 'font-size 0.3s'
                }}>
                    {collapsed ? 'V6' : 'NewsPanel'}
                </h1>
                {!collapsed && <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.role} Dashboard</p>}
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none' }}>
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <NavLink
                                title={collapsed ? item.label : ''}
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: collapsed ? '0' : '12px',
                                    padding: collapsed ? '12px 0' : '12px 24px',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    color: isActive ? 'var(--sidebar-active)' : 'var(--sidebar-text)',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    transition: 'all 0.3s',
                                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent'
                                })}
                            >
                                <span style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>
                                    {item.icon}
                                </span>
                                {!collapsed && <span style={{ opacity: 1, transition: 'opacity 0.2s' }}>{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="user-profile" style={{
                padding: collapsed ? '1rem 0.5rem' : '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: collapsed ? 'center' : 'stretch'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        {user.name.charAt(0)}
                    </div>
                    {!collapsed && (
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                        </div>
                    )}
                </div>
                <button
                    title={collapsed ? 'Logout' : ''}
                    onClick={onLogout}
                    className="btn"
                    style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        width: collapsed ? '40px' : '100%',
                        height: collapsed ? '40px' : 'auto',
                        padding: collapsed ? '0' : '0.5rem 1rem',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        borderRadius: collapsed ? '50%' : '8px',
                        transition: 'all 0.3s'
                    }}
                >
                    <LogOut size={18} />
                    {!collapsed && <span style={{ marginLeft: '8px' }}>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
