import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ImageComparison } from '../components/ImageComparison';

// Dynamic sliding images from our folders (1 to 6)
const DYNAMIC_SLIDER_IMAGES = [
  { before: '/dynamic-images/1/image-before.jpg', after: '/dynamic-images/1/image-after.jpg' },
  { before: '/dynamic-images/2/image-before.jpg', after: '/dynamic-images/2/image-after.jpg' },
  { before: '/dynamic-images/3/image-before.jpg', after: '/dynamic-images/3/image-after.jpg' },
  { before: '/dynamic-images/4/image-before.jpg', after: '/dynamic-images/4/image-after.jpg' },
  { before: '/dynamic-images/5/image-before.jpg', after: '/dynamic-images/5/image-after.jpg' },
  { before: '/dynamic-images/6/image-before.jpg', after: '/dynamic-images/6/image-after.jpg' }
];

// Fallback images specifically for other elements
const IMAGES = {
  heroBefore: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArqPowGBLAp8pMsuJrEuujEurP2gxvVLE9xbpce_pURZDiQQR8eTSVbvHPa_pykbgPE_4zF482qlSzKV54omRCMkZxwlEHlsyXngCODEc-7qWwcj_MDv8O_15IzoxKrtV4RnczjSIN4_nQ7XK4aWNJawOmJDHwcApyvrr2yEbYPTp2FXCPM-bTUJkPj5xGHYM7XbWm_CnpjkzIUjIbFrxfJQcbo02U3jG6WD5JYAY_rSsyaXMMQ69u4PrBMHVAsIl0s_FTUHkMjXv1',
  heroAfter: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGIr49qEuXKjQgobGExbmSW7f-txrR6hkz46nD54lwJTfB1HaKqG4z--4dJwUlIukF0tn78EpTEk-7FadwE2Ia0_J6ru9WyKHltkcYgIggMcZxzuvM_c3vzbDu22AkA_PQwAJ2oKyT8eLXWpwzg_8fJGwO0t3OzMwc2qVv7AQudXUoNhd-dx8qmjUM8jQvl7Ijh1IAemqZ2GXR1O-0WWjIY45E0Fcfggb_7efA3cM4kaMyNr4GUspoIn4iecyaoCPAg36CpTt8F9QI',
  spatialAnalysis: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0pjbez3EViaYRGNZv02B7u7991FmsrsNC7uAjx4CwnsfdRkwrzRaKEUUHbLvg2YK-dNbsWk7cVDM_JhBhI8rLasWBm08TPzTtz87P-bXDjxNWIWj0Tv2sBDPcUD3URm_yjIaqWm7RClwXpsWg2W_e0XOMIZ00FDRBh8Zo7d1OduffP-ve2PSwEwdWmMOLwGRJV1qWJDCN2ufjXbdtbZRqt2o4xCIO-3EVRW5xNdqWpsahIeboBE8m2jGss4xwuvEgYoIw-lkKmb53',
  chair: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL1q30hikvS3_1KTqrxkuBhceHZrfsqUxdoyR-m4FD_ToFtSsGn8y05CegG7ICmmNeXET8XsEmPk_z2fbMlnwg3YzwDAyHFrYBGc-pcb7gLQOtLPDAHe8lIZyLdLPOwUVZaWXj2U-VmvTvUJ1s1NuEQHMc8RplrJhqcMembE86U3Vh_jvML_ujhFByMkTwvEVgPVXAwS8dDqrZzpcIejTAInVwsTk0FlJixNDi_EbrgKOgay7rmZBTAf4_C3N8BB3P022fBVSNbFy8',
  lamp: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwUQ9b8la0BpMEAUOm4V9QqITnvnLJ54MhPqElRjG0ey702u0z5NpbsHqrWlj7_54jomZ0Vig9YDQ_3Kclc8bkQb0K86mU7YgeaMzBPB3Xmjc7ipB8_7lvEnrBQiQnqFydhuF8OwLGc2qT9y6leDFj3SzfTRdvMMGpGg5rrOd5sQFvlRjBImr9vG8yTI1hIhQSZQvtr479OLE4S6524Ppa1UuoDnY0VrNGZdWlNqDOizazF3VLZJGKW1WJ44Og_VcqG004bJB_A3IO',
  art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPlhcrN9r_7NBSqli5Yl9YkXq5VLendfMVBX0xD9qWxrLjjZ9kKKAha49-AsnQCVCR_aEhAeW6ozJQMOcIu4dPPDEDgcKgDC2GncIVNA2XqapwmziuqRr9yQ95HSSNfWh6NFNk8o3eiSLVUnlBAn9VR447q6naa7enq1Q5i10_ckDSMebRpJq1gafccU9ZM2mK_hOIwigCFWpXbMgFiTfY0_jdmzOr7hg-BjgOlkov1415RmD7wKANzFKNmBln-jKahnQwig1x-Tvv',
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Landing() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Rotate images every 2 minutes (120,000 ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % DYNAMIC_SLIDER_IMAGES.length);
    }, 120000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="pt-24 overflow-x-hidden">
      {/* ───── Hero Section ───── */}
      <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="z-10"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 rounded-full bg-surface-container-high text-primary text-xs font-label font-medium tracking-[0.1em] mb-6 outline outline-1 outline-outline-variant/15"
          >
            AI-POWERED INTERIOR DESIGN
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter mb-8 leading-[1.1]"
          >
            Transform your room{' '}
            <span className="hero-gradient-text">instantly</span> with AI
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-on-surface-variant text-xl font-light mb-12 max-w-lg leading-relaxed"
          >
            Upload a photo and let our AI redesign your interior in seconds.
            Experience high-end aesthetics without the architect fees.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6">
            <motion.button
              onClick={() => navigate('/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline font-bold px-10 py-5 rounded-xl neon-glow text-lg flex items-center justify-center gap-2"
            >
              Get Started
              <span className="material-symbols-outlined">arrow_forward</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/gallery')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/5 border border-outline-variant/15 backdrop-blur-md px-10 py-5 rounded-xl font-headline font-bold text-lg hover:bg-white/10 transition-all"
            >
              View Showcase
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero Image — Before/After Split */}
        <motion.div
          className="relative group w-full flex items-center justify-center h-full min-h-[500px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity" />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center p-4"
            >
              <ImageComparison
                beforeSrc={DYNAMIC_SLIDER_IMAGES[currentSlideIndex].before}
                afterSrc={DYNAMIC_SLIDER_IMAGES[currentSlideIndex].after}
                beforeLabel="Before"
                afterLabel="After"
                className="w-full h-full max-h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ───── Bento Grid Features ───── */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold font-headline mb-4 tracking-tight">
            The Future of <span className="text-tertiary">Interior Design</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Experience a curated workflow that combines neural rendering with professional spatial planning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Large Card */}
          <motion.div
            className="md:col-span-2 bg-surface-container-low rounded-[2rem] p-10 flex flex-col justify-between group overflow-hidden relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
                architecture
              </span>
              <h3 className="text-3xl font-extrabold font-headline mb-4">Neural Spatial Analysis</h3>
              <p className="text-on-surface-variant max-w-md text-lg font-light leading-relaxed">
                Our AI understands depth, lighting, and architectural constraints to ensure designs are both beautiful and physically viable.
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              <div className="h-48 w-full bg-surface-container-high rounded-xl overflow-hidden">
                <img src={IMAGES.spatialAnalysis} alt="Spatial analysis" className="w-full h-full object-cover opacity-50" />
              </div>
            </div>
          </motion.div>

          {/* Infinite Styles Card */}
          <motion.div
            className="bg-surface-container-high rounded-[2rem] p-10 border border-outline-variant/10 flex flex-col items-start gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="p-4 bg-tertiary/10 rounded-2xl">
              <span className="material-symbols-outlined text-3xl text-tertiary">palette</span>
            </div>
            <h3 className="text-2xl font-extrabold font-headline">Infinite Styles</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">
              From Scandinavian Minimalism to Industrial Chic, explore curated aesthetic profiles instantly.
            </p>
            <div className="w-full space-y-3 pt-4">
              {['Mid-Century Modern', 'Japandi Bloom', 'Cyberpunk Loft'].map((s) => (
                <div key={s} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                  <span className="text-sm font-label uppercase tracking-widest">{s}</span>
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Instant Gratification Card */}
          <motion.div
            className="bg-surface-container-highest rounded-[2rem] p-10 flex flex-col gap-6 items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative w-full aspect-square rounded-2xl bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              <span className="material-symbols-outlined text-7xl text-white/20">upload_file</span>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg py-3 flex items-center justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-label">Processing Image...</span>
              </div>
            </div>
            <h3 className="text-2xl font-extrabold font-headline">Instant Gratification</h3>
            <p className="text-on-surface-variant font-light">
              See your dream home in less than 30 seconds. No waiting for renderings, just magic.
            </p>
          </motion.div>

          {/* Shop the Look Card */}
          <motion.div
            className="md:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-12 border border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex-1">
              <h3 className="text-3xl font-extrabold font-headline mb-4">Shop the Look</h3>
              <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-6">
                Our AI doesn't just design; it sources. Instantly get a catalog of furniture and decor pieces that match your new room.
              </p>
              <button className="text-primary font-bold flex items-center gap-2 hover:underline">
                Explore the Marketplace <span className="material-symbols-outlined">north_east</span>
              </button>
            </div>
            <div className="flex gap-4">
              {[IMAGES.chair, IMAGES.lamp, IMAGES.art].map((src, i) => (
                <div key={i} className={`w-24 h-24 rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant/20 ${i === 1 ? 'translate-y-6' : ''}`}>
                  <img src={src} alt="Furniture" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="max-w-7xl mx-auto px-8 py-32 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <motion.h2
          className="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter mb-8 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Ready to redefine your{' '}
          <span className="hero-gradient-text">Living Space?</span>
        </motion.h2>

        <motion.p
          className="text-on-surface-variant text-xl font-light mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Join 50,000+ homeowners and interior designers using Decora AI to build the future of living.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline font-bold px-12 py-6 rounded-xl neon-glow text-xl"
          >
            Start Your Free Transformation
          </motion.button>
        </motion.div>

        <p className="mt-8 text-on-surface-variant/60 text-sm font-label tracking-widest uppercase">
          No credit card required • AI Credits included
        </p>
      </section>
    </main>
  );
}
