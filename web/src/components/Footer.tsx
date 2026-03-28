export default function Footer() {
  return (
    <footer className="bg-background w-full py-12 border-t border-white/5 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
        <div className="text-lg font-bold text-on-surface font-headline">Decora AI</div>
        <div className="flex gap-8">
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-body font-light text-sm tracking-wide">Privacy Policy</a>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-body font-light text-sm tracking-wide">Terms of Service</a>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-body font-light text-sm tracking-wide">Contact</a>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-body font-light text-sm tracking-wide">Instagram</a>
        </div>
        <div className="text-on-surface-variant font-body font-light text-sm tracking-wide text-center md:text-right">
          © 2024 Decora AI. The Digital Atelier.
        </div>
      </div>
    </footer>
  );
}
