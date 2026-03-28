import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto">
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant">menu</span>
          <h1 className="text-xl font-bold tracking-tighter text-slate-900">Decora AI</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcVdB4ZusAQ1yw3fSPJQysl-M_7t5VGmGQSTV6YE6wbS4raYTdoZRMhYVBsJ4tQgTq8h4Q2ztZi7j36gPaPSjBEf7_v2mXfi2XQ8OMPttLar0LzVivRLG-B_iq9Fbz1Mx_N0HEqZPByJZgCP3h4shCgNsxwux2CRFcoTiS2Z65C_vdBdFiormYXyarJmcyElUaeRVZajwkGnb_kqPqHKOpN9znGB8VVrVC-6l6J0dhV6lDzoOsGIcVWkKXZ4l6jBG_DjjUrn4E3PAz" 
            alt="User profile" 
            className="w-full h-full object-cover" 
          />
        </div>
      </header>

      <section className="mb-8">
        <div className="relative flex items-center bg-surface-container-lowest rounded-full px-6 py-4 shadow-sm">
          <span className="material-symbols-outlined text-outline mr-3">search</span>
          <input 
            type="text" 
            placeholder="Search your creations..." 
            className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder-outline font-medium outline-none" 
          />
        </div>
      </section>

      <section className="flex gap-3 mb-10 overflow-x-auto no-scrollbar -mx-6 px-6">
        <button className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold tracking-wide transition-all active:scale-95">All</button>
        <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-semibold tracking-wide hover:bg-surface-container-highest transition-all active:scale-95">Modern</button>
        <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-semibold tracking-wide hover:bg-surface-container-highest transition-all active:scale-95">Minimal</button>
        <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-semibold tracking-wide hover:bg-surface-container-highest transition-all active:scale-95">Scandinavian</button>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="group flex flex-col gap-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-sm group-hover:shadow-xl transition-all duration-300">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaGwfD_TGWsZKBRjVWmVmh_6YpJuzt2-zJjN9WV30xFj6Dr0diczG1Dqdn-x64qvw1H0081bEzX7llFKXxOAKsoQSMDThk2WSJZvR19dLsVCQVPEJCaKmZgMCMSYjy6vhN_ZYyxi6OStaI_kY-5zhwHnya0tZiIxUJzEWBNomtUq1J6MDrsIgyQH0arUzWU_gaCo1A1_erXi4AuHPMG3KITf1oaTCAaOJfXXjh-8xnA0kKzY5tiZEvEzVsCvR1gx9JGlAsjsMDdDwo" alt="Modern living room" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
        </div>

        <div className="group flex flex-col gap-3 mt-8">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-sm group-hover:shadow-xl transition-all duration-300">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1SFcwbZQNoYRuOoDhMcwQ1vK3CkNgpgMzL_ejA_pEPEhKjPFlktZpYhYubrZTK09ds0P-X3NdMnv0uAj5MK2p9di5N-kHGXyt9GKxqXdtqg9zvA4XCxjhFEpy4lofgjuSqnBsoP6i4vU9PyFF7ANc7flWB-izqr9h87ROhOEAktIAU-SUbcvcJm5LpjBfTQeJ6ST6pU4eGT10Sc-ZXhjoTeq4rJazxRrScETPKjpOIYd7IJsfDLbgNU6cBbyeGLgcfoRpEdj6ZnfN" alt="Minimalist study" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
        </div>

        <div className="group flex flex-col gap-3 -mt-8">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-sm group-hover:shadow-xl transition-all duration-300">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAySZJMV8RertfpBrV7KL7CepuQfhaqqKRtvbpll5ViMVD7WJ2NzR32P-SITBx5pgfcZUVqn3HCC15Q-YdBsXjl9l-hPxXUIosB-q_7Dj0ck493hda4XPwD_TYknx-HfFEXj8oUSlbqqVblmCfBzFfcGC81z7K6PRF7sIRjrYjHPXblZL4uJ4ubhEzYckA6yQT1HtwimzOm6qLk77JsV4huV4FM7oZJaO88Vh91btiHLazcVlBX_L2olx2Zi6MUHIJ4ltDN63cW7U_" alt="Dark aesthetic room" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
        </div>

        <div className="group flex flex-col gap-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-sm group-hover:shadow-xl transition-all duration-300">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe7GDamt940EcBXJ_N9DaN4V4KLJdxq8MiBfw3nJxrY32W-SoWP1k1aukBBm4UYkAG503RB7dNKh1fln2CWi4nMGQok9QedPAQsNP1T5DS0_VWO_sXpGgfAdfi-Tvszf3VPXXSZR4nRW3LA35pEUEq5qmlM0_fGnIBBe4lnzzpluP1VOje_C3FrQKQFBw7ogAPRGdnWYuAzVWNGso5emIVhMUyxOiHFo93P3QUztx7f01l9QlJGW7QaOAeKL8ewmcslwbv1IEF1uGL" alt="Luxury kitchen" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
