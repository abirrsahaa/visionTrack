"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { SystemButton } from "@/components/shared/SystemButton";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { ScrollReveal, StaggerReveal } from "@/components/landing/ScrollReveal";
import { JourneyAnimation } from "@/components/landing/JourneyAnimation";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { CountUp } from "@/components/shared/CountUp";
import { Mountain, Cloud, Sparkles, Target, Sparkles as SparklesIcon, Brain, BookOpen, ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Your Effort Becomes Art";

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  // Typing effect for hero
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-purple/30 selection:text-white">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Layers */}
        <ParallaxSection speed={0.3} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 opacity-5">
            <Mountain className="w-96 h-96 text-foreground mx-auto" strokeWidth={1} />
          </div>
        </ParallaxSection>

        <ParallaxSection speed={0.6} className="absolute inset-0 pointer-events-none">
          <div className="relative h-full">
            <motion.div
              className="absolute top-20 left-10"
              animate={{ x: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            >
              <Cloud className="w-32 h-32 text-gray-700 opacity-20" strokeWidth={1} />
            </motion.div>
            <motion.div
              className="absolute top-40 right-20"
              animate={{ x: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            >
              <Cloud className="w-40 h-40 text-gray-600 opacity-10" strokeWidth={1} />
            </motion.div>
          </div>
        </ParallaxSection>

        <ParallaxSection speed={0.8} className="absolute inset-0 pointer-events-none">
          <div className="relative h-full">
            <motion.div
              className="absolute top-32 left-1/4"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-8 h-8 text-purple-400 opacity-50" />
            </motion.div>
            <motion.div
              className="absolute bottom-32 right-1/4"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-orange-400 opacity-50" />
            </motion.div>
          </div>
        </ParallaxSection>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-3 py-1 rounded-full border border-purple/30 bg-purple/10 text-purple-light text-xs font-mono tracking-wider">
                V 4.0 // SYSTEM OPERATIONAL
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block mb-2">{displayedText}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
                {fullText.slice(displayedText.length)}
              </span>
              {displayedText.length === fullText.length && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block ml-2 text-purple-500"
                >
                  |
                </motion.span>
              )}
            </motion.h1>

            <motion.p
              className="mt-8 text-xl sm:text-2xl leading-relaxed text-foreground-secondary max-w-2xl mx-auto font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Transform your daily effort into evolving visual art. <br />
              Every journal entry, every task — pixels that color your vision.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link href="/sign-up">
                <SystemButton
                  variant="gradient-purple"
                  size="lg"
                  className="px-10 py-6 text-lg tracking-wide shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]"
                >
                  INITIATE SYSTEM
                  <ArrowRight className="ml-2 w-5 h-5" />
                </SystemButton>
              </Link>
              <Link href="/sign-in">
                <SystemButton
                  variant="outline"
                  size="lg"
                  className="px-10 py-6 text-lg border-gray-700 hover:bg-white/5"
                >
                  ACCESS TERMINAL
                </SystemButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border border-gray-700 rounded-full flex justify-center bg-background/50 backdrop-blur">
            <motion.div
              className="w-1 h-2 bg-purple-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Journey Demonstration Section */}
      <section className="relative py-32 bg-background-secondary border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-mono">
                VISUALIZE PROGRESS
              </h2>
              <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
                From weekly pixelations to your complete annual vision board.
                See consistnecy transform into reality.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <JourneyAnimation className="max-w-5xl mx-auto" />
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-mono">
                SYSTEM MODULES
              </h2>
              <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
                A complete operating system for self-introspection and disciplined progress.
              </p>
            </div>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Target className="w-7 h-7" />}
              title="Multi-Domain"
              description="Create domains for different areas of your life—Career, Health, Learning. Each domain becomes part of your visual journey."
              delay={0}
            />
            <FeatureCard
              icon={<SparklesIcon className="w-7 h-7" />}
              title="Pixel & Bit"
              description="Every journal entry earns pixels. Watch your grayscale canvas come alive day by day as you complete tasks."
              delay={0.1}
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7" />}
              title="AI Architect"
              description="Get personalized goal breakdown, daily reflections, and adaptive task planning powered by AI."
              delay={0.2}
            />
            <FeatureCard
              icon={<BookOpen className="w-7 h-7" />}
              title="Narrative Log"
              description="Weekly wraps tell your story. See how your effort, challenges, and growth weave together."
              delay={0.3}
            />
          </StaggerReveal>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-24 border-y border-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-background-secondary opacity-50" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="p-6 rounded-2xl bg-background/50 border border-gray-800"
              >
                <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono">
                  <CountUp to={10000} suffix="+" />
                </div>
                <div className="text-purple-400 text-lg font-mono">PIXELS GENERATED</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-background/50 border border-gray-800"
              >
                <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono">
                  <CountUp to={85} suffix="%" />
                </div>
                <div className="text-orange-400 text-lg font-mono">COMPLETION RATE</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-background/50 border border-gray-800"
              >
                <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono">
                  <CountUp to={30} suffix=" d" />
                </div>
                <div className="text-green-400 text-lg font-mono">AVG STREAK</div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-mono">
                READY TO ARCHITECT YOUR LIFE?
              </h2>
              <p className="text-xl text-foreground-secondary mb-10 max-w-2xl mx-auto">
                Join thousands who are turning their goals into beautiful, tangible progress.
                Start your visual journey today.
              </p>
              <Link href="/sign-up">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <SystemButton
                    size="lg"
                    variant="gradient-orange"
                    className="px-10 py-5 text-xl font-semibold shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]"
                  >
                    <span className="relative z-10 flex items-center">
                      INITIALIZE BOARD
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </span>
                  </SystemButton>
                </motion.div>
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
