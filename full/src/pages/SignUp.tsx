import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background text-on-surface overflow-x-hidden">
      <header className="flex items-center px-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          aria-label="Go back" 
          className="flex size-10 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="pt-4 pb-10">
          <h1 className="text-on-surface text-[3.5rem] font-bold leading-[1.1] tracking-[-0.04em] mb-4">
            Join the Atelier
          </h1>
          <p className="text-on-surface-variant text-base font-normal leading-relaxed max-w-[280px]">
            Design your dream space with artificial intelligence.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <div className="flex flex-col gap-2">
            <label className="text-on-surface text-sm font-semibold px-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full h-14 px-5 rounded-[20px] border-none bg-surface-container-low text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-on-surface text-sm font-semibold px-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full h-14 px-5 rounded-[20px] border-none bg-surface-container-low text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-on-surface text-sm font-semibold px-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Create a password" 
                className="w-full h-14 px-5 rounded-[20px] border-none bg-surface-container-low text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                <span className="material-symbols-outlined">visibility_off</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => navigate('/app/home')}
            className="w-full h-14 mt-4 rounded-[20px] bg-primary-container text-on-primary font-semibold text-base shadow-[0_10px_30px_rgba(83,65,205,0.15)] active:scale-[0.98] transition-transform"
          >
            Create Account
          </button>

          <div className="flex items-center gap-4 py-6">
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            <span className="text-outline text-xs font-bold uppercase tracking-widest">Or continue with</span>
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-14 rounded-[20px] bg-surface-container-lowest border-none shadow-sm active:scale-[0.98] transition-transform">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYMsKfXutoc7imQIDf5p30Bhw4EiIIByyot2nlYFkyXhtxbcUidSTy82y5_6Yq5Z6ChBsiK-YKWLNt0ugiiP4d2Ua66KM8o7jaw0_LspuNkH2h8o_8fpCpSNaKAnLpS7fXePPmMvZd52WjUZDmV9UkskXEUSlfDKMckQd1cHmscYT7ezizZzN7_21EWTMLIjwDE5uGg16Y77ZK1ol2rQVKJ6KqIFZH_O6wArdSdtF68qT8KL1qESqBZ-LzI6GKWklM6be3-CJkS-OR" alt="Google" className="w-5 h-5" />
              <span className="text-on-surface text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-14 rounded-[20px] bg-on-surface text-surface-container-lowest active:scale-[0.98] transition-transform">
              <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>apple</span>
              <span className="text-sm font-semibold">Apple</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-on-surface-variant text-sm font-medium">
          Already have an account? 
          <button onClick={() => navigate('/')} className="text-primary font-bold ml-1 hover:underline">Login</button>
        </p>
      </footer>
    </div>
  );
}
