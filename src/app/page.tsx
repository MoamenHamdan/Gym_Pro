import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import Hero from '@/components/home/Hero'
import Programs from '@/components/home/Programs'
import Banner from '@/components/home/Banner'
import StatsBanner from '@/components/home/StatsBanner'
import Motivational from '@/components/home/Motivational'
import Features from '@/components/home/Features'
import Feedback from '@/components/home/Feedback'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <Banner
        type="promo"
        title="Ready to Transform Your Body?"
        subtitle="Join thousands of members achieving their fitness goals with our proven programs"
        icon="fire"
        gradient="purple-pink"
      />
      <Programs />
      <StatsBanner />
      <Motivational />
      <Features />
      <Banner
        type="cta"
        title="Start Your Fitness Journey Today!"
        subtitle="Unlock your potential with expert guidance and personalized training programs"
        icon="trophy"
        gradient="blue-cyan"
      />
      <Feedback />
      <Footer />
    </main>
  )
}

