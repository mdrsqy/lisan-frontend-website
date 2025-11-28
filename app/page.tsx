import Navbar from "@/components/landing/Navbar"
import HeroSection from "@/components/landing/HeroSection"
import FeaturesSection from "@/components/landing/FeatureSection"
import BenefitsSection from "@/components/landing/BenefitSection"
import HowItWorksSection from "@/components/landing/HowItWorkSection"
import TestimonialsSection from "@/components/landing/TestimonialSection"
import PricingSection from "@/components/landing/PricingSection"
import FaqSection from "@/components/landing/FaqSection"
import CtaSection from "@/components/landing/CtaSection"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#0A0F1C] text-slate-100 font-sans overflow-x-hidden">
      <Navbar />

      <div className="-mt-10 md:mt-0 w-full">
        <HeroSection />
      </div>


      <div className="hidden md:flex relative z-10 bg-[#0A0F1C] flex-col w-full space-y-20 sm:space-y-32">
        <FeaturesSection />
        <BenefitsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
        <Footer />
      </div>
    </main>
  )
}