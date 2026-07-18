"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Sparkles, Eye, Server, Cloud, Layout } from "lucide-react";

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: "Artificial Intelligence / ML",
      icon: Brain,
      gradient: "from-blue-500 to-indigo-500",
      coreSkills: [
        { name: "Python", level: 95 },
        { name: "Machine Learning", level: 90 },
        { name: "Deep Learning", level: 88 },
        { name: "TensorFlow / PyTorch", level: 85 },
      ],
      otherSkills: [
        "Neural Networks",
        "Scikit-learn",
        "Model Training & Evaluation",
        "Hyperparameter Tuning",
        "Feature Engineering",
        "Model Deployment"
      ]
    },
    {
      title: "Generative AI & LLMs",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      coreSkills: [
        { name: "Large Language Models (LLMs)", level: 80 },
        { name: "RAG (Retrieval Augmented)", level: 50 },
        { name: "OpenAI API Integration", level: 92 },
        { name: "Vector Databases", level: 55 },
      ],
      otherSkills: [
        "Prompt Engineering",
        "ollama",
        "Hugging Face Transformers",
        "Embedding Models",
        "AI Agents (Basic)"
      ]
    },
    {
      title: "Computer Vision & Doc Intel",
      icon: Eye,
      gradient: "from-cyan-500 to-teal-500",
      coreSkills: [
        { name: "OpenCV", level: 88 },
        { name: "YOLOv8", level: 85 },
        { name: "PaddleOCR / EasyOCR", level: 90 },
        { name: "OCR Pipelines", level: 88 },
      ],
      otherSkills: [
        "Image Classification",
        "Object Detection",
        "Image Segmentation",
        "Face Recognition",
        "Document Processing Systems"
      ]
    },
    {
      title: "Backend & AI Systems",
      subtitle: "Focus on AI integration & optimization",
      icon: Server,
      gradient: "from-green-500 to-emerald-500",
      coreSkills: [
        { name: "FastAPI", level: 70 },
        { name: "Flask", level: 82 },
        { name: "Node.js", level: 20 },
      ],
      otherSkills: [
        "REST APIs",
        "Microservices (Basics)",
        "JWT Authentication",
        "Scalable API Design",
        "Background Workers"
      ]
    },
    {
      title: "Deployment & MLOps",
      icon: Cloud,
      gradient: "from-amber-500 to-orange-500",
      coreSkills: [
        { name: "Docker", level: 45 },
        { name: "Model Deployment", level: 88 },
      ],
      otherSkills: [
        "MLflow (Basics)",
        "Vercel / Netlify",
        "AWS (EC2 / S3 Basics)"
      ]
    },
    {
      title: "Frontend (AI Product Layer)",
      subtitle: "Building interactive AI interfaces",
      icon: Layout,
      gradient: "from-rose-500 to-red-500",
      coreSkills: [
        { name: "Next.js", level: 92 },
        { name: "React", level: 90 },
        { name: "TypeScript", level: 85 },
      ],
      otherSkills: [
        "Tailwind CSS",
        "Responsive UI Design",
        "API Integration"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="skills" ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skills</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Technologies I work with to build intelligent systems
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 bg-gradient-to-br ${category.gradient} rounded-lg text-white`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{category.title}</h3>
                      {category.subtitle && (
                        <p className="text-xs text-gray-400 mt-0.5">{category.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {category.coreSkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-200 text-sm font-medium">{skill.name}</span>
                          <span className="text-gray-400 text-xs">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${category.gradient}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Tools & Frameworks
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.otherSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs font-medium rounded bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
