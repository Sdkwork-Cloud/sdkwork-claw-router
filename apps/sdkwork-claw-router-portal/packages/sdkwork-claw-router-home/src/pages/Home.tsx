import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { ModelShowcase } from 'sdkwork-claw-router-models';
import { AppCenterPreview } from 'sdkwork-claw-router-app-center';
import { SupportedModalities } from '../components/SupportedModalities';
import { DownloadSection } from '../components/DownloadSection';

export function Home() {
  return (
    <main>
      <Hero />
      <SupportedModalities />
      <Features />
      <ModelShowcase />
      <AppCenterPreview />
      <DownloadSection />
    </main>
  );
}
