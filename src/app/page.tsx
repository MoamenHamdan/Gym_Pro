import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Programs from '@/components/home/Programs'
import Motivational from '@/components/home/Motivational'
import Features from '@/components/home/Features'
import Feedback from '@/components/home/Feedback'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <Hero />
      <Programs />
      <Motivational />
      <Features />
      <Feedback />
      <Footer />
    </main>
  )
}

