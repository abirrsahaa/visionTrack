"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/stores";
import { Button } from "@/components/shared/Button";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { ScrollReveal, StaggerReveal } from "@/components/landing/ScrollReveal";
import { JourneyAnimation } from "@/components/landing/JourneyAnimation";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { CountUp } from "@/components/shared/CountUp";
import { Mountain, Cloud, Sparkles, Target, Sparkles as SparklesIcon, Brain, BookOpen, ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Your Effort Becomes Art";

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Layers */}
        <ParallaxSection speed={0.3} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 opacity-10">
            <Mountain className="w-96 h-96 text-gray-400 mx-auto" strokeWidth={1} />
          </div>
        </ParallaxSection>

        <ParallaxSection speed={0.6} className="absolute inset-0 pointer-events-none">
          <div className="relative h-full">
            <motion.div
              className="absolute top-20 left-10"
              animate={{ x: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            >
              <Cloud className="w-32 h-32 text-blue-100 opacity-40" strokeWidth={1} />
            </motion.div>
            <motion.div
              className="absolute top-40 right-20"
              animate={{ x: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            >
              <Cloud className="w-40 h-40 text-purple-100 opacity-30" strokeWidth={1} />
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
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute bottom-32 right-1/4"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
          </div>
        </ParallaxSection>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block mb-2">{displayedText}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                {fullText.slice(displayedText.length)}
              </span>
              {displayedText.length === fullText.length && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block ml-2"
                >
                  |
                </motion.span>
              )}
            </motion.h1>

            <motion.p
              className="mt-6 text-xl sm:text-2xl leading-8 text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Transform your daily effort into evolving visual art. Every journal entry,
              every completed task—they become pixels that color your vision board.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400">
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Journey Demonstration Section */}
      <section className="relative py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Watch Your Vision Unfold
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From weekly pixelations to your complete annual vision board—
                see how consistency transforms your goals into reality.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <JourneyAnimation className="max-w-5xl mx-auto" />
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A complete system designed for self-introspection and disciplined progress.
              </p>
            </div>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Target className="w-7 h-7" />}
              title="Multi-Domain Vision"
              description="Create domains for different areas of your life—Career, Health, Learning, Finance. Each domain becomes part of your visual journey."
              delay={0}
            />
            <FeatureCard
              icon={<SparklesIcon className="w-7 h-7" />}
              title="Progressive Coloring"
              description="Every journal entry and completed task earns pixels that colorize your vision board. Watch your grayscale canvas come alive day by day."
              delay={0.1}
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7" />}
              title="AI Coaching"
              description="Get personalized goal breakdown, daily reflections, and adaptive task planning powered by AI. Your journey, intelligently guided."
              delay={0.2}
            />
            <FeatureCard
              icon={<BookOpen className="w-7 h-7" />}
              title="Narrative-Driven"
              description="Weekly wraps tell your story. See how your effort, challenges, and growth weave together into a meaningful narrative of progress."
              delay={0.3}
            />
          </StaggerReveal>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
              >
                <div className="text-5xl font-bold mb-2">
                  <CountUp to={10000} suffix="+" />
                </div>
                <div className="text-blue-100 text-lg">Pixels Earned Daily</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-5xl font-bold mb-2">
                  <CountUp to={85} suffix="%" />
                </div>
                <div className="text-blue-100 text-lg">Average Completion Rate</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-5xl font-bold mb-2">
                  <CountUp to={30} suffix=" days" />
                </div>
                <div className="text-blue-100 text-lg">Average Streak</div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Ready to transform your life?
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Join thousands who are turning their goals into beautiful, tangible progress.
                Start your visual journey today.
              </p>
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    className="px-10 py-5 text-xl font-semibold shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      Create Your Vision Board
                      <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear",
                      }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
