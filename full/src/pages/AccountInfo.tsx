import { useNavigate } from 'react-router-dom';

export default function AccountInfo() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-8 px-6 max-w-lg mx-auto space-y-10">
      <header className="bg-background/80 backdrop-blur-xl fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center active:scale-95 transition-transform duration-200">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-semibold tracking-tight text-on-surface">Account Info</h1>
        <button className="flex items-center justify-center active:scale-95 transition-transform duration-200">
          <span className="material-symbols-outlined text-on-surface">settings</span>
        </button>
      </header>

      <section className="flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-lowest shadow-sm ring-4 ring-white">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe43f9pMEd0rAD3IBaLSNRWW5tEzFE76CxdpXUGin8_PtnsdVTidQZ_EE_zLUuVVzyALbQv6CS42fbsDkVqcIcucNjOt8OlC7iab7PQi_jUTur8K2w3TJU6djinSv7P2EiLsis9djMaMXf053XA5tLW0vRMBk8MnAQnIwGkh6NQwN_RGxxcAycs1jMRoHPlwgriD0bUrElxOW_Z0po6l9Ok2MJYjLWmC4ADebWCnbuEz4jnc9-pjEwWV9nN8IRrerLtw6Ejjvs2Pog" 
              alt="User Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-primary-container text-on-primary p-2.5 rounded-full shadow-lg active:scale-90 transition-transform duration-200">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">Alex Thompson</h2>
          <p className="text-on-surface-variant">Premium Member</p>
        </div>
      </section>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="Alex Thompson" 
                placeholder="Enter your full name" 
                className="w-full bg-surface-container-low border-none rounded-[20px] px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                defaultValue="alex.thompson@decora.ai" 
                placeholder="name@example.com" 
                className="w-full bg-surface-container-low border-none rounded-[20px] px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <input 
                type="tel" 
                defaultValue="+1 (555) 123-4567" 
                placeholder="+1 (000) 000-0000" 
                className="w-full bg-surface-container-low border-none rounded-[20px] px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Location</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="San Francisco, CA" 
                placeholder="City, Country" 
                className="w-full bg-surface-container-low border-none rounded-[20px] px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/30 transition-all outline-none" 
              />
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/50">location_on</span>
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="h-[1px] bg-outline-variant/15 w-full"></div>
        </div>

        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-primary-container text-on-primary font-semibold py-4 rounded-[20px] shadow-[0_10px_30px_rgba(83,65,205,0.2)] active:scale-[0.98] transition-all duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
