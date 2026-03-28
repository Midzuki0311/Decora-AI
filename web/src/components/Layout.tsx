import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAuthBlock, setShowAuthBlock] = useState(false);

  useEffect(() => {
    if (searchParams.get('auth_required') === 'true') {
      setShowAuthBlock(true);
      // Clean up the URL
      searchParams.delete('auth_required');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-background text-on-background font-body relative">
      <Navbar />
      <Outlet />
      <Footer />

      {/* Registration Block Modal */}
      <AnimatePresence>
        {showAuthBlock && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-surface-container-low rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 relative overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-error/20 blur-[50px] rounded-full" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-6 shadow-lg">
                  <span className="material-symbols-outlined text-on-error-container text-3xl">lock</span>
                </div>
                <h2 className="text-2xl font-headline font-bold mb-3">Registration Required</h2>
                <p className="text-on-surface-variant font-light mb-8">
                  You must be logged in to view History and Settings. Please create a free account or log in to continue.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button onClick={() => {
                    localStorage.setItem('user_logged_in', 'true');
                    setShowAuthBlock(false);
                    navigate('/');
                  }} className="w-full py-4 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">login</span>
                    Log In / Register (Mock)
                  </button>
                  <button onClick={() => setShowAuthBlock(false)} className="w-full py-4 rounded-xl font-bold bg-surface-container-highest text-on-surface hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
