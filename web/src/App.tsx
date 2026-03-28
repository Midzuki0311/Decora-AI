import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Create from './pages/Create';
import Result from './pages/Result';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Features from './pages/Features';

// A simple mock for protected routes
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
  if (!isLoggedIn) {
    // If not logged in, redirect home with a hash to trigger the auth modal 
    // or we can use state. We'll use a specific query param.
    return <Navigate to="/?auth_required=true" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<Create />} />
          <Route path="/result" element={<Result />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/features" element={<Features />} />
          {/* Mock routes to satisfy History/Settings auth block */}
          <Route path="/history" element={<RequireAuth><div className="pt-32 text-center text-on-surface">History</div></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><div className="pt-32 text-center text-on-surface">Settings</div></RequireAuth>} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
