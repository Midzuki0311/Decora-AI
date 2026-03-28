import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto space-y-10">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform duration-200 text-on-surface">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-semibold text-lg tracking-tight text-on-surface">Edit Profile</h1>
          <button onClick={() => navigate(-1)} className="text-primary font-semibold hover:opacity-80 transition-opacity active:scale-95">
            Save
          </button>
        </div>
        <div className="bg-surface-container-low h-[1px] w-full"></div>
      </header>

      <section className="flex flex-col items-center justify-center space-y-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh4t0yTMRHUYvTKk1lKabtjbcRKb7olHdgnxafIghorI5oA3bOCPBJyu-l6EytZPPvsWcKVk9FGki00qjNiTBrP77SFN6ks8IiIamRkxiqZ6Z8Wn7sp-N6VAtguErh2dtVS80S8PR6nRJgbH5lbyiVCqhU6I57EAjPMfgHpwD6ppJJXZaa2gphHomY3qeGQr6iRoSbbV6pmfaBMuTLvsbQlR5rEvd32-oGa2CyE1kEwaAjNOZyGfOe-015QSitV6xjD0XtectjCbVe" 
              alt="Alex Rivers" 
              className="w-full h-full object-cover" 
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-primary p-2.5 rounded-full text-on-primary shadow-lg hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
        </div>
        <button className="text-primary font-medium text-sm hover:underline">Change Photo</button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-2">Personal Info</h2>
        <div className="bg-surface-container-lowest rounded-2xl p-1 space-y-1 shadow-sm">
          <div className="p-4 space-y-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              defaultValue="Alex Rivers" 
              placeholder="Enter your name" 
              className="w-full bg-transparent border-none p-0 text-on-surface font-medium focus:ring-0 text-base outline-none" 
            />
          </div>
          <div className="h-[1px] bg-surface-container-low mx-4"></div>
          <div className="p-4 space-y-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              defaultValue="alex@decora.ai" 
              placeholder="Enter your email" 
              className="w-full bg-transparent border-none p-0 text-on-surface font-medium focus:ring-0 text-base outline-none" 
            />
          </div>
          <div className="h-[1px] bg-surface-container-low mx-4"></div>
          <div className="p-4 space-y-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Bio</label>
            <textarea 
              rows={2} 
              defaultValue="Interior Design Enthusiast" 
              placeholder="Tell us about yourself" 
              className="w-full bg-transparent border-none p-0 text-on-surface font-medium focus:ring-0 text-base resize-none outline-none"
            ></textarea>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-2">Design Preferences</h2>
        <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-6 shadow-sm">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Preferred Styles</label>
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                Modern <span className="material-symbols-outlined text-[14px]">close</span>
              </span>
              <span className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                Minimal <span className="material-symbols-outlined text-[14px]">close</span>
              </span>
              <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[16px]">add</span> Add Style
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Default Resolution</label>
            <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-full">
              <button className="flex-1 py-2 text-xs font-semibold text-on-surface-variant rounded-full transition-all">Standard</button>
              <button className="flex-1 py-2 text-xs font-bold text-on-primary bg-primary rounded-full shadow-sm transition-all">High</button>
              <button className="flex-1 py-2 text-xs font-semibold text-on-surface-variant rounded-full transition-all">Ultra</button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-2">Account Security</h2>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-on-surface">Change Password</p>
                <p className="text-xs text-outline">Last changed 3 months ago</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      </section>

      <section className="pt-4 pb-12">
        <button onClick={() => navigate('/')} className="w-full p-4 rounded-2xl border border-error/20 text-error font-semibold text-sm hover:bg-error/5 transition-colors">
          Sign Out
        </button>
      </section>
    </div>
  );
}
