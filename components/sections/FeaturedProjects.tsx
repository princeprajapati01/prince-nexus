"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockProjects = [
  {
    id: "billvaultai",
    title: "BillVaultAI",
    slug: "billvaultai",
    description: "AI-powered Intelligent Document Processing platform that extracts and analyzes invoice data using OCR, Computer Vision, and automation workflows.",
    technologies: ["YOLO", "PaddleOCR", "FastAPI", "Next.js", "PostgreSQL"],
    githubUrl: "https://github.com/princeprajapati/billvaultai",
    demoUrl: "https://billvaultai.com",
    coverImage: "/projects/billvaultai-cover.jpg",
    featured: true,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "credmint",
    title: "CredMint",
    slug: "credmint",
    description: "AI-powered full-stack fintech platform that digitizes the loan process with KYC verification, EMI tracking, and AI-driven investment advice.",
    technologies: ["React Native", "Flask", "MySQL", "Ollama"],
    githubUrl: "https://github.com/princeprajapati/credmint",
    demoUrl: "https://credmint.com",
    coverImage: "/projects/credmint-cover.jpg",
    featured: true,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "task-classification",
    title: "Task Classification System",
    slug: "task-classification",
    description: "Machine Learning and NLP-based system that classifies user tasks into categories such as Work, Personal, and Health using TF-IDF and Scikit-learn.",
    technologies: ["Python", "Scikit-learn", "NLP", "TF-IDF"],
    githubUrl: "https://github.com/princeprajapati/task-classification",
    demoUrl: null,
    coverImage: "/projects/task-classification-cover.jpg",
    featured: true,
    gradient: "from-green-500 to-teal-500",
  },
];

const FeaturedProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<any[]>(mockProjects);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // Only show featured projects on the landing page if specified
          const featuredOnly = data.data.filter((p: any) => p.featured && p.published);
          if (featuredOnly.length > 0) {
            setProjects(featuredOnly);
          } else {
            setProjects(data.data.filter((p: any) => p.published));
          }
        }
      } catch (err) {
        console.error("Failed to load projects from DB:", err);
      }
    }
    loadProjects();
  }, []);

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
    <section id="projects" ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Building intelligent systems that solve real-world problems
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="h-48 relative overflow-hidden bg-gray-950 flex items-center justify-center border-b border-white/5">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${project.gradient || "from-blue-600 to-purple-600"} flex items-center justify-center`}>
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-white/10 rounded-full text-gray-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="View on GitHub"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {(project.demoUrl || (project.images && project.images.length > 0)) && (
                    <Link
                      href={project.images && project.images.length > 0 ? `/projects/${project.slug}/live-demo` : project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="View Live Demo"
                    >
                      <ExternalLink size={20} />
                    </Link>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="ml-auto text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm font-medium group/link"
                  >
                    View Details
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
