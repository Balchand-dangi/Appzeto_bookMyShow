import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('bms_token');
            const storedUser = localStorage.getItem('bms_user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch {
            localStorage.removeItem('bms_token');
            localStorage.removeItem('bms_user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('bms_token', jwtToken);
        localStorage.setItem('bms_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('bms_token');
        localStorage.removeItem('bms_user');
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};

export default AuthContext;
