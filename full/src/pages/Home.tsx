import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 px-4 max-w-2xl mx-auto space-y-10">
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tighter text-on-surface">Decora AI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden ring-2 ring-white/10">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqAPOxb7pA-R_jcZU-KKbHngJooS0SYwI2m_mIqG75LoL18BZRgWpfeYJnGjFSxWE0jiO5GT68D72jHgzIty68fK68we4O23qBDwR9eRzCt-pb6oHawwiuQl4FrRspGLLyI3cmMhzzaTz9EtViX0GHC7mdF1LizYqWVm8RvwfmcPR-MeK6Zs2MvCE-kiLrqkB7eX4hXJjLgtlmGubO7ajv48q9UVY_VEWtIln1MI9-BOm4p6ktQb2r9kimDr0M7Y5OcgRrrdAZVvjb" 
              alt="User profile" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div 
          onClick={() => navigate('/app/create')}
          className="relative group cursor-pointer active:scale-[0.98] transition-transform duration-300"
        >
          <div className="aspect-[4/5] w-full rounded-[20px] overflow-hidden bg-surface-container">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgHjf8EoyF2Y_CbWCjwDy-Fz8V9FW21u5bXvn85E1Jlsg5LTm_4b_6pnMKk26tHdYtEOgSzqGiolhKyFu6aM6X1BoC-kfZ-IsaEC5Ul78xxnvAfMy5TakpU8BfVzRCq1wYjA_qUIMzVzqoULzH3c_lLfowPclhbC_cD87ZQ23HqnJKuFFJepmbnuI3uk4HJETQKD6ieLR0BuoyAsnj_ffKU_1jLSZQnTcQnVIGHd218H-Q0AcvoeI00v3hLnYfF7FdGtu2s3tp7j_j" 
              alt="Serene Living Room" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-[20px]">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-white text-[10px] font-bold tracking-wider mb-2">FEATURED</span>
            <h3 className="text-white text-2xl font-semibold tracking-tight">Serene Living Room</h3>
            <p className="text-white/80 text-sm">Redesigned with AI</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/app/create')}
          className="relative group cursor-pointer active:scale-[0.98] transition-transform duration-300"
        >
          <div className="aspect-[4/5] w-full rounded-[20px] overflow-hidden bg-surface-container">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_5wYcq3ptaW1LYMtlgwPcVjQU19kFhVCMifnOK20dLMfPWAkLRXqc3mdS4hsZNI46Qzy-hrl3nXzfai7G1dKo3X4veSc2HMqiEXU-9Ts09erjpXXbioydoLLZO8oWDvxhmg0oqVL0Iv1Me_hkJucr9V8Hq-3TOTUr-XP2fGMX01SEF77H6FWpX0CnMG1EQ2y-Z_f9xCIiLFC0xzIPExyjCsFTeeqxQuB14v8K9B-fgy3p66i1zlEryYBG7NIh00q--uBkckRp_bSR" 
              alt="Minimalist Oasis" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-[20px]">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-white text-[10px] font-bold tracking-wider mb-2">NEW</span>
            <h3 className="text-white text-2xl font-semibold tracking-tight">Minimalist Oasis</h3>
            <p className="text-white/80 text-sm">Redesigned with AI</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.5rem] font-semibold tracking-tight">Select Style</h2>
          <span className="text-primary text-sm font-medium cursor-pointer hover:underline">View all</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 -mx-4 px-4">
          <button className="px-6 py-3 rounded-full bg-primary text-on-primary whitespace-nowrap font-medium transition-all active:scale-95">Modern</button>
          <button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface-variant whitespace-nowrap font-medium transition-all hover:bg-surface-container-highest active:scale-95">Luxury</button>
          <button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface-variant whitespace-nowrap font-medium transition-all hover:bg-surface-container-highest active:scale-95">Japanese</button>
          <button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface-variant whitespace-nowrap font-medium transition-all hover:bg-surface-container-highest active:scale-95">Minimal</button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <label className="text-[0.6875rem] font-bold tracking-[0.05em] text-on-surface-variant uppercase px-1">Design Prompts</label>
          <div className="relative group">
            <textarea 
              className="w-full min-h-[120px] bg-surface-container-low border-none rounded-[20px] p-5 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/30 transition-all resize-none outline-none" 
              placeholder="Add details... (e.g., 'Add a velvet sofa and warm ambient lighting')"
            ></textarea>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/app/create')}
          className="w-full h-16 bg-primary-container text-white rounded-[20px] font-semibold text-lg shadow-[0_10px_30px_rgba(108,92,231,0.25)] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.97] transition-all duration-200"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          Generate Design
        </button>
      </section>
    </div>
  );
}
