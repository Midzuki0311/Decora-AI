import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto">
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface cursor-pointer">menu</span>
          <h1 className="font-semibold tracking-tight text-on-surface text-lg">Profile</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL7nR_SJdzlmdFARpyEk59go646J1zV0aHsVmryxtlVmR8eUchi-3oKTEvDVDlBiaf4pGd9mhRNFTrtZHuOTuwtyVo7Zh0lcOj2c0QVn8owQ-6UUt85EPCNXSc4V2gwdRe0Bj3xRqhB2tFqskdVHz8TKEERBQzTFj7DB6FQO1NdEXuSWpNDDM9FaKmW2lHHukR2Dea9k-j7Y7lolcpRctiUv3m9F3cE--IQJD2Q6T_-wBGEBiMk_rnFBDM2NtMcJiadpbTgizWt0Ex" 
            alt="User profile" 
            className="w-full h-full object-cover" 
          />
        </div>
      </header>

      <section className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-container mb-4">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL7nR_SJdzlmdFARpyEk59go646J1zV0aHsVmryxtlVmR8eUchi-3oKTEvDVDlBiaf4pGd9mhRNFTrtZHuOTuwtyVo7Zh0lcOj2c0QVn8owQ-6UUt85EPCNXSc4V2gwdRe0Bj3xRqhB2tFqskdVHz8TKEERBQzTFj7DB6FQO1NdEXuSWpNDDM9FaKmW2lHHukR2Dea9k-j7Y7lolcpRctiUv3m9F3cE--IQJD2Q6T_-wBGEBiMk_rnFBDM2NtMcJiadpbTgizWt0Ex" 
              alt="Alex Thompson" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface">Alex Thompson</h2>
        <p className="text-on-surface-variant font-medium text-sm mt-1 uppercase tracking-wider">Interior Enthusiast</p>
      </section>

      <section className="mb-10">
        <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-1">Credit Balance</p>
              <h3 className="text-3xl font-bold text-on-surface">12 <span className="text-lg font-medium text-on-surface-variant">/ 20 Credits</span></h3>
            </div>
            <button className="bg-primary-container text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg shadow-primary-container/20 hover:scale-105 transition-transform">
              Upgrade
            </button>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary-container w-[60%] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium text-on-surface-variant">
              <span>Current Usage</span>
              <span>60% Used</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2 mb-10">
        <h4 className="px-2 pb-2 text-[11px] font-bold text-on-surface-variant tracking-widest uppercase">Settings</h4>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <button onClick={() => navigate('/app/profile/account')} className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low group-hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <span className="font-medium text-on-surface">Account Info</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-sm">chevron_right</span>
          </button>
          
          <button onClick={() => navigate('/app/settings')} className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low group-hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
              </div>
              <span className="font-medium text-on-surface">App Settings</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-sm">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group border-t border-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low group-hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">help</span>
              </div>
              <span className="font-medium text-on-surface">Help & Support</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-sm">chevron_right</span>
          </button>
        </div>
      </section>

      <section className="flex justify-center">
        <button onClick={() => navigate('/')} className="text-error font-semibold text-sm hover:opacity-70 transition-opacity px-6 py-3">
          Sign Out
        </button>
      </section>
    </div>
  );
}
