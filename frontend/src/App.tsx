// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth.ts';
import BaseLayout from './components/layout/BaseLayout';
import { LoginForm } from './components/ui/LoginForm';
import { RegisterForm } from './components/ui/RegisterForm';
import { Dashboard } from './pages/Dashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <div className="page-loader">Завантаження...</div>;
    }

    return (
        <BaseLayout user={user} onLogout={logout}>
            <Routes>
                <Route
                    path="/"
                    element={
                        user
                            ? <Navigate to="/dashboard" />
                            : <Navigate to="/login" />
                    }
                />

                <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/" />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* Захищені маршрути */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <section className="panel-card">
                            Профіль користувача
                        </section>
                    </ProtectedRoute>
                } />
            </Routes>
        </BaseLayout>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;