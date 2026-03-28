import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDesignStore, type GalleryItem } from '../store/designStore';

const STYLES_FILTER = ['All', 'Modern', 'Luxury', 'Minimalist', 'Japanese', 'Industrial'];

export default function Gallery() {
  const { gallery } = useDesignStore();
  const [filter, setFilter] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredGallery = filter === 'All'
    ? gallery
    : gallery.filter((item) => item.style.toLowerCase() === filter.toLowerCase());

  // Flatten all generated images for display
  const allImages = filteredGallery.flatMap((item: GalleryItem) =>
    item.generatedImages.map((img) => ({
      ...img,
      originalUrl: item.originalUrl,
    }))
  );

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <motion.header
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tighter mb-4">
          Your <span className="ai-gradient-text">Gallery</span>
        </h1>
        <p className="text-on-surface-variant text-lg font-light max-w-lg">
          Browse your past AI transformations. Click any image to view it in full detail.
        </p>
      </motion.header>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 mb-12">
        {STYLES_FILTER.map((s) => (
          <motion.button
            key={s}
            onClick={() => setFilter(s)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-full font-headline font-bold text-sm transition-all ${
              filter === s
                ? 'glass-card border border-primary/40 text-primary neon-glow-primary'
                : 'bg-surface-container-high/40 border border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Gallery Grid */}
      {allImages.length === 0 ? (
        <motion.div
          className="text-center py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-24 h-24 rounded-full bg-surface-container-highest/60 mx-auto flex items-center justify-center mb-6 shadow-2xl border border-white/10">
            <span className="material-symbols-outlined text-4xl text-primary/40">photo_library</span>
          </div>
          <h3 className="font-headline font-bold text-2xl mb-2">No designs yet</h3>
          <p className="text-on-surface-variant font-light max-w-md mx-auto">
            Your gallery is empty. Upload a photo and generate your first AI design to see it here.
          </p>
        </motion.div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {allImages.map((img, i) => (
            <motion.div
              key={img.id}
              className="group relative rounded-[2rem] overflow-hidden bg-surface-container-low border border-outline-variant/15 cursor-pointer shadow-xl break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => setLightboxImg(img.url)}
            >
              <img
                src={img.url}
                alt={img.style}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="px-3 py-1 bg-primary/80 backdrop-blur rounded-full text-xs font-label font-bold uppercase tracking-widest text-on-primary w-fit">
                  {img.style}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            className="fixed inset-0 z-[100] bg-surface-container-lowest/95 backdrop-blur-2xl flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full rounded-3xl overflow-hidden border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white z-10 hover:bg-white/20 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <img
                src={lightboxImg}
                alt="Full view"
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
