import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { ModelShowcase } from 'sdkwork-clawrouter-pc-models';
import { AppCenterPreview } from 'sdkwork-clawrouter-pc-app-center';
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
