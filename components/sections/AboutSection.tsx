"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Brain, Database, Sparkles } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "Projects Built", value: "5+", icon: Code },
    { label: "Technologies", value: "10+", icon: Database },
    { label: "AI Solutions", value: "3+", icon: Brain },
    { label: "Lines of Code", value: "15K+", icon: Sparkles },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="about" ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transforming ideas into intelligent systems
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.p variants={itemVariants} className="text-gray-300 text-lg leading-relaxed">
              As an <span className="text-blue-400 font-semibold">AI Engineer</span>, I am driven by a passion for transforming innovative ideas into <span className="text-purple-400 font-semibold">intelligent systems</span> that solve real-world problems and create lasting impact.
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-300 text-lg leading-relaxed">
              My work focuses on <span className="text-blue-400 font-semibold">Artificial Intelligence</span>, <span className="text-purple-400 font-semibold">Deep Learning</span>, <span className="text-pink-400 font-semibold">Computer Vision</span>, <span className="text-blue-400 font-semibold">Natural Language Processing</span>, and <span className="text-purple-400 font-semibold">scalable AI deployment</span>. I build production-ready AI solutions that automate complex workflows, extract actionable insights from data, and enhance business operations through intelligent decision-making.
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-300 text-lg leading-relaxed">
              From <span className="text-blue-400 font-semibold">document intelligence platforms</span> and <span className="text-purple-400 font-semibold">OCR systems</span> to <span className="text-pink-400 font-semibold">financial technology solutions</span> and <span className="text-blue-400 font-semibold">AI-powered automation</span>, I am committed to developing technology that is not only innovative but also practical, scalable, and valuable. By combining technical expertise with a problem-solving mindset, I strive to bridge the gap between AI research and real-world implementation.
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-300 text-lg leading-relaxed">
              My goal is to contribute to the <span className="text-blue-400 font-semibold">future of intelligent technology</span> by building reliable, impactful, and <span className="text-purple-400 font-semibold">human-centered AI systems</span> that empower organizations and drive digital transformation.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4">
              <a
                href="#contact"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg shadow-blue-500/50 hover:scale-105"
              >
                Let's Work Together
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                      <Icon size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {stat.value}
                    </h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
