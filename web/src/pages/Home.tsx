import HeroSlider from '../components/HeroSlider';
import ImageUpload from '../components/ImageUpload';
import StyleChips from '../components/StyleChips';
import PromptInput from '../components/PromptInput';
import GenerateButton from '../components/GenerateButton';

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-12 pb-16">
        <HeroSlider />
      </section>

      {/* Divider */}
      <div className="w-full max-w-xl mx-auto px-8 mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
      </div>

      {/* Upload + Configure + Generate */}
      <section className="px-4 sm:px-6 space-y-10">
        <ImageUpload />
        <StyleChips />
        <PromptInput />
        <GenerateButton />
      </section>

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
}
