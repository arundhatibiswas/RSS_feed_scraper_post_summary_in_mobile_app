import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditorDashboard from './pages/EditorDashboard';
import SubEditorDashboard from './pages/SubEditorDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Articles from './pages/Articles';
import Users from './pages/Users';
import { SocketProvider } from './context/SocketContext';

const ProtectedRoute = ({ user, roles, children }) => {
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />; // Redirect to home or unauthorized page
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        navigate('/');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    if (loading) return <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600 }}>Loading V6 News...</div>;

    const getHomeRoute = () => {
        if (!user) return "/login";
        if (user.role === 'ADMIN') return "/admin";
        if (user.role === 'EDITOR') return "/editor";
        if (user.role === 'SUB_EDITOR') return "/sub-editor";
        return "/login";
    };

    return (
        <SocketProvider>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/login" element={user ? <Navigate to={getHomeRoute()} /> : <Login onLogin={handleLogin} />} />

                    {/* Redirect root based on role */}
                    <Route path="/" element={user ? <Navigate to={getHomeRoute()} /> : <Navigate to="/login" />} />

                    <Route
                        path="/*"
                        element={
                            user ? (
                                <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
                                    <Sidebar
                                        user={user}
                                        onLogout={handleLogout}
                                        collapsed={sidebarCollapsed}
                                    />
                                    <div className="main-content" style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100vh',
                                        overflow: 'hidden',
                                        transition: 'margin-left 0.3s ease'
                                    }}>
                                        <Header
                                            user={user}
                                            onToggleSidebar={toggleSidebar}
                                            sidebarCollapsed={sidebarCollapsed}
                                        />
                                        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -15 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Routes>
                                                    <Route path="/admin" element={<ProtectedRoute user={user} roles={['ADMIN']}><Dashboard user={user} /></ProtectedRoute>} />
                                                    <Route path="/users" element={<ProtectedRoute user={user} roles={['ADMIN']}><Users /></ProtectedRoute>} />
                                                    <Route path="/editor" element={<ProtectedRoute user={user} roles={['EDITOR', 'ADMIN']}><EditorDashboard /></ProtectedRoute>} />
                                                    <Route path="/sub-editor" element={<ProtectedRoute user={user} roles={['SUB_EDITOR', 'ADMIN']}><SubEditorDashboard /></ProtectedRoute>} />
                                                    <Route path="/articles" element={<Articles />} />
                                                    <Route path="*" element={<div className="card">Page under development</div>} />
                                                </Routes>
                                            </motion.div>
                                        </main>
                                    </div>
                                </div>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </AnimatePresence>
        </SocketProvider>
    );
}

export default App;
