import { HeroSection } from '@/components/HeroSection'
import { FeatureCards } from '@/components/FeatureCards'
import { StorySection } from '@/components/StorySection'

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <StorySection />
      <FeatureCards />
    </div>
  )
}
