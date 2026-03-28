import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background text-on-surface antialiased">
      <header className="relative w-full h-[45vh] lg:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 hero-mask">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS2I3jIwG8j4mv0hPQWi2qzuyvc_9ztM-MfRoQw8snqySjb-F9HgpXztKVgORl2nqtI5k-a5gz47Tcw70TVn61pypEqQ3VwBBX5Gb16A0ZtzFx2vt4wq-TXPWWzAX30gh-_c4G91v5VOQfPfBwx_ct-2b5tXFLDx9fGEcETIuJZb0MffzASp3gNWXV6uvrPbhtEz_y8UPnIQqpzyNfk_vZCM36M6PPSGu3BPcbsuYBHyVW7e8Jx0yCW3Ne5oORuSJmhQPLdNbBaIPT" 
            alt="Luxury minimalist living room" 
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/10"></div>
        </div>
        
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 h-20 transition-all duration-300">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900">Decora AI</span>
          </div>
        </nav>
      </header>

      <main className="relative z-10 w-full max-w-md px-8 -mt-20 lg:-mt-32 pb-12 flex-grow flex flex-col items-center justify-center text-center">
        <section className="mb-12">
          <h1 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-tighter text-on-surface mb-4">
            Redesign your world
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-[280px] mx-auto opacity-70">
            The digital curator for your dream living space.
          </p>
        </section>

        <div className="w-full flex flex-col gap-4">
          <button className="w-full h-14 bg-on-surface text-surface flex items-center justify-center gap-3 rounded-[20px] font-semibold active:scale-[0.98] transition-all duration-200">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.1-41.2.6-84.1 23.3-111.4 61.1-41.1 56.4-18.2 163.6 22 225.2 21 32 46.5 61.2 78.5 60.5 30.1-.7 42.6-19.1 82.5-19.1 39.2 0 52.3 19.1 82.7 18.3 32.1-.7 55-26.6 75-55.5 24.3-35.2 34.1-69.5 34.5-71.1-.8-.3-66.2-25.4-66.5-101.7zm-61.9-198.7c17.5-21 28.9-50.5 25.7-80-25.5 1-56 16.9-74.4 38.4-16.1 18.5-30.1 48.6-26.3 77.3 28.2 2.2 57.5-14.7 75-35.7z"></path></svg>
            <span>Sign in with Apple</span>
          </button>
          
          <button className="w-full h-14 bg-surface-container-lowest text-on-surface flex items-center justify-center gap-3 rounded-[20px] font-semibold border border-outline-variant/10 shadow-sm active:scale-[0.98] transition-all duration-200">
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335"></path><path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"></path><path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"></path><path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"></path></svg>
            <span>Sign in with Google</span>
          </button>
          
          <button onClick={() => navigate('/signup')} className="w-full h-14 bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center gap-3 rounded-[20px] font-semibold active:scale-[0.98] transition-all duration-200">
            <span className="material-symbols-outlined">mail</span>
            <span>Continue with Email</span>
          </button>
        </div>
      </main>

      <footer className="w-full pb-10 px-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-[1px] w-8 bg-outline-variant/20"></span>
          <p className="text-on-surface-variant text-sm font-medium opacity-60">or explore anonymously</p>
          <span className="h-[1px] w-8 bg-outline-variant/20"></span>
        </div>
        
        <button onClick={() => navigate('/signup')} className="inline-block text-on-surface group">
          <span className="text-sm font-medium opacity-60">New to the atelier?</span>
          <span className="text-sm font-bold text-primary ml-1 group-hover:underline transition-all">Create Account</span>
        </button>
        
        <div className="mt-8 flex justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Cookies</a>
        </div>
      </footer>
    </div>
  );
}
