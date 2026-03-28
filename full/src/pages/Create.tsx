import { useNavigate } from 'react-router-dom';

export default function Create() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto space-y-8">
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-on-surface active:scale-95 duration-200">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tighter text-on-surface">Decora AI</h1>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Cd3y7U1lkwbSueVYkwIlA0r1G1nBMbfCFT202tbQyI2AWu2vYajI0b7eeejQRV-tx1BizwKvAlpuKt_bgfoqNyavfr0DZbN_d5d1gAhyqdjXDosNza4Dqsvu9E6Ggf3N1lULorlmvmwWRC3IJjTvi1KhlwFBop3RqOBr086YMFegqYHnGPROaE6fbV1Ju-qdAaj47dQpCiMKn_QpypC9SFACawQ-cGlWJMlD26lBUYX2R3lqCgtg1keQoXyz1gNVDSfGVmwyFnQS" 
              alt="User profile" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      <section className="relative group">
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container shadow-sm transition-transform duration-300 group-hover:scale-[1.01]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4dPVg5dokdtt_tShboVZUAxJzPBBbivtVmOD-KzdA62hAL25atievs3Noze4G0SUQTmiT7Z4B88l-blbveev35xa--C-eE_ntT6JixZ6W2EBg_cAgtAwXzgaTpJzbtBTIiYQv0JiQVnkPDDBXP047wHpJYJv_eTEnKqFmWYmyxImMvM46YSWh5PRcP3ZZXqsdR-V-RypWvo1JFitiV866XmrxkOagLubKJo4m4-BaUN03YZ6QfkmnY15Kq44QZWpYw_a9dB-neYtV" 
            alt="Uploaded room" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
              <span className="material-symbols-outlined text-sm">cloud_upload</span>
              Original Space
            </div>
          </div>
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full text-primary shadow-lg hover:bg-white active:scale-90 transition-all">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-[1.5rem] font-semibold tracking-tight text-on-surface">Select Aesthetic</h2>
          <span className="text-[0.6875rem] font-semibold text-primary/60 uppercase tracking-widest">Recommended</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 py-2">
          <button className="flex-shrink-0 bg-primary text-on-primary px-6 py-3 rounded-full font-medium shadow-lg shadow-primary/20 transition-all active:scale-95">
            Modern
          </button>
          <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-full font-medium hover:bg-surface-container-highest transition-all active:scale-95">
            Luxury
          </button>
          <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-full font-medium hover:bg-surface-container-highest transition-all active:scale-95">
            Japanese
          </button>
          <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-full font-medium hover:bg-surface-container-highest transition-all active:scale-95">
            Industrial
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[1.5rem] font-semibold tracking-tight text-on-surface">Custom Directives</h2>
        <div className="relative">
          <textarea 
            className="w-full bg-surface-container-low border-none rounded-2xl p-5 min-h-[120px] text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-shadow resize-none outline-none" 
            placeholder="Add specific details (e.g., 'Add a velvet navy sofa', 'Warm oak flooring')..."
          ></textarea>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <span className="material-symbols-outlined text-outline text-lg">auto_fix_high</span>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest p-6 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-tertiary-fixed rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary">filter_4</span>
          </div>
          <div>
            <p className="font-medium text-on-surface">Generate 4 Variations</p>
            <p className="text-xs text-outline">High resolution render</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </section>

      <div className="pb-4">
        <button className="w-full bg-primary-container text-on-primary-container py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 duration-300 ease-out flex items-center justify-center gap-3">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          Generate Design
        </button>
      </div>
    </div>
  );
}
