import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto space-y-8">
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRYkFoKVwJ3IIiHqDptNwli-DR-99gxCcrjezFkbqKzKJzYji0ud3X05xn5eC14xPtJ80_4WId63dmCQ4SMIss83v6_FN4-MvvZq0uh64bqlwPCZOeO7rLwf7FCqRl9oaN9qfjrv3Oa9-vWB5kH06vG5C-xkjWEPgXAzM8aVpoDoRdge-F867BYBpYFAZ3J4NcwFCSnmV-lKrHCYS_k4iAsLUWdD1_vQpppgqVem3wgCSpCdwvAhHp5VMgTzE3seh7Io7G4ga-P9p8" 
              alt="User profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-on-surface">Decora AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface">search</span>
        </div>
      </header>

      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">Settings</h2>
        <p className="text-on-surface-variant/60 text-sm">Manage your profile and creative preferences</p>
      </div>

      <section className="space-y-3">
        <h3 className="text-[0.6875rem] font-bold tracking-widest text-on-surface-variant/50 uppercase px-1">Account</h3>
        <div className="bg-surface-container-lowest rounded-[20px] overflow-hidden shadow-sm">
          <button onClick={() => navigate('/app/profile/edit')} className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-on-surface">Profile Information</div>
                <div className="text-xs text-on-surface-variant/60">Manage your name and avatar</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-on-surface">Email & Password</div>
                <div className="text-xs text-on-surface-variant/60">Update security credentials</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-on-surface">Payment Methods</div>
                <div className="text-xs text-on-surface-variant/60">Visa ending in 4242</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[0.6875rem] font-bold tracking-widest text-on-surface-variant/50 uppercase px-1">Design Preferences</h3>
        <div className="bg-surface-container-lowest rounded-[20px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">hd</span>
              </div>
              <div>
                <div className="font-semibold text-on-surface">High Resolution Rendering</div>
                <div className="text-xs text-on-surface-variant/60">Prioritize quality over speed</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-5 border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">auto_awesome_motion</span>
              </div>
              <div>
                <div className="font-semibold text-on-surface">Default Style</div>
                <div className="text-xs text-on-surface-variant/60">Applied to new projects</div>
              </div>
            </div>
            <div className="relative">
              <select className="appearance-none bg-surface-container-low text-on-surface text-sm font-medium py-2 pl-4 pr-10 rounded-full border-none focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Luxury</option>
                <option>Modern</option>
                <option>Minimalist</option>
                <option>Industrial</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[0.6875rem] font-bold tracking-widest text-on-surface-variant/50 uppercase px-1">Notifications</h3>
        <div className="bg-surface-container-lowest rounded-[20px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <div>
                <div className="font-semibold text-on-surface">New Design Ready</div>
                <div className="text-xs text-on-surface-variant/60">Instant push alerts</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-5 border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <div>
                <div className="font-semibold text-on-surface">Marketing Updates</div>
                <div className="text-xs text-on-surface-variant/60">New styles and features</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[0.6875rem] font-bold tracking-widest text-on-surface-variant/50 uppercase px-1">Support</h3>
        <div className="bg-surface-container-lowest rounded-[20px] overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">help_center</span>
              </div>
              <div className="text-left font-semibold text-on-surface">Help Center</div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">open_in_new</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">policy</span>
              </div>
              <div className="text-left font-semibold text-on-surface">Privacy Policy</div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <div className="text-left font-semibold text-on-surface">Terms of Service</div>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
          </button>
        </div>
      </section>

      <div className="pt-4 pb-12">
        <button onClick={() => navigate('/')} className="w-full py-5 bg-error-container text-on-error-container font-bold rounded-[20px] flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
        <p className="text-center text-[10px] text-on-surface-variant/40 mt-6 uppercase tracking-widest font-semibold">Decora AI v2.4.0 • Made with love</p>
      </div>
    </div>
  );
}
