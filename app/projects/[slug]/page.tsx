"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// This would normally come from database
const projectsData: { [key: string]: any } = {
  billvaultai: {
    title: "BillVaultAI",
    description: "AI-powered Intelligent Document Processing platform that extracts and analyzes invoice data using OCR, Computer Vision, and automation workflows.",
    coverImage: "/projects/billvaultai-cover.jpg",
    problem: "Businesses struggle with manual invoice processing, leading to errors, delays, and increased operational costs. Traditional OCR solutions lack the intelligence to handle varied document formats and extract meaningful insights.",
    solution: "BillVaultAI combines state-of-the-art computer vision (YOLO) and OCR (PaddleOCR) with intelligent data extraction pipelines. The system automatically detects document types, extracts structured data, and provides analytics dashboards for financial insights.",
    architecture: "The system uses a microservices architecture with FastAPI backend, Next.js frontend, and PostgreSQL database. YOLO handles document detection and layout analysis, while PaddleOCR extracts text. A custom NLP pipeline processes and structures the extracted data.",
    features: [
      "Intelligent document detection and classification",
      "Multi-format invoice processing (PDF, images, scanned documents)",
      "Automated data extraction with 95%+ accuracy",
      "Real-time analytics dashboard",
      "RESTful API for integration",
      "Batch processing capabilities",
    ],
    technologies: ["YOLO", "PaddleOCR", "FastAPI", "Next.js", "PostgreSQL", "OpenCV", "Python", "TypeScript"],
    challenges: "The main challenges included handling diverse document formats, maintaining high OCR accuracy across different quality scans, and optimizing processing speed for real-time applications. We solved these through custom preprocessing pipelines and model fine-tuning.",
    learnings: "This project deepened my understanding of computer vision pipelines, OCR optimization techniques, and building production-grade AI systems. I learned the importance of preprocessing in OCR accuracy and effective ways to structure document intelligence workflows.",
    results: "BillVaultAI achieves 95%+ accuracy in data extraction, processes documents 10x faster than manual entry, and has been successfully deployed for invoice processing workflows.",
    githubUrl: "https://github.com/princeprajapati/billvaultai",
    demoUrl: "https://billvaultai.com",
    date: "2026",
  },
  credmint: {
    title: "CredMint",
    description: "AI-Based Loan and Smart Financial Management System that helps users manage finances, track loans, and make informed financial decisions.",
    coverImage: "/projects/credmint-cover.jpg",
    problem: "Traditional loan systems are slow, require manual document verification, lack repayment transparency, and provide limited access to affordable financial advice.",
    solution: "CreditMint is a full-stack fintech platform that digitizes the loan process with online KYC verification, automated EMI management, and an AI-powered investment advisor. It enables users to apply for loans, track repayments, and receive personalized investment suggestions across web and mobile platforms.",
    architecture: `Frontend: React (Admin & User), React Native (Expo)
Backend: Dual Flask REST APIs (Admin & User)
Database: MySQL with SQLAlchemy
AI: Ollama (Mistral) + Rule Engine + Yahoo Finance API
Authentication: JWT & Biometric Login`,
    features: [
      "Digital Loan Application & KYC Upload",
      "Admin Loan & Document Verification",
      "Automated EMI Schedule & Penalty Tracking",
      "AI Investment Advisor with Live Stock Data",
      "Credit Score & Loan Tracking Dashboard",
      "Secure JWT and Biometric Authentication",
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Bootstrap", "AdminLTE", "React Native", "Expo", "Python", "Flask", "Flask-JWT-Extended", "MySQL", "SQLAlchemy", "Ollama (Mistral)", "yfinance", "Axios", "Chart.js"],
    challenges: `Managing AI conversation flow using a rule engine.
Synchronizing two Flask backends with a shared database.
Standardizing KYC uploads across web and mobile platforms.`,
    learnings: `Built a scalable full-stack fintech application.
Integrated AI with business logic for reliable recommendations.
Gained experience in REST APIs, JWT authentication, React Native, and MySQL.`,
    results: `🚀 Faster digital loan processing through automated KYC.
🤖 AI-powered investment recommendations with live market data.
📊 Transparent EMI tracking and repayment management.
📱 Seamless experience across Web, Admin Dashboard, and Mobile App.`,
    githubUrl: "https://github.com/princeprajapati/credmint",
    demoUrl: "https://credmint.com",
    date: "2025",
  },
  "task-classification": {
    title: "Task Classification System",
    description: "Machine Learning and NLP-based system that classifies user tasks into categories such as Work, Personal, and Health using TF-IDF and Scikit-learn.",
    coverImage: "/projects/task-classification-cover.jpg",
    problem: "Users waste time manually organizing tasks and struggle to prioritize effectively. Traditional task managers lack intelligent categorization and contextual understanding.",
    solution: "An ML-based classifier that automatically categorizes tasks using NLP techniques. The system uses TF-IDF for feature extraction and trained classifiers to predict task categories with high accuracy.",
    architecture: "Python-based system using Scikit-learn for ML pipeline, NLTK for text preprocessing, and Flask for API deployment. The model is trained on a curated dataset of labeled tasks.",
    features: [
      "Automatic task categorization",
      "Multi-class classification (Work, Personal, Health, etc.)",
      "High accuracy prediction",
      "API endpoint for integration",
      "Model retraining capability",
    ],
    technologies: ["Python", "Scikit-learn", "NLP", "TF-IDF", "Flask", "NLTK"],
    challenges: "The main challenges were handling ambiguous task descriptions, achieving good accuracy with limited training data, and making the model robust to varied input formats.",
    learnings: "This project strengthened my understanding of NLP pipelines, feature engineering, and model evaluation techniques. I learned effective ways to handle text classification problems and optimize model performance.",
    results: "The system achieves 88% accuracy in task classification and successfully categorizes tasks for improved productivity.",
    githubUrl: "https://github.com/princeprajapati/task-classification",
    demoUrl: null,
    date: "2025",
  },
};

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.data) {
          const found = data.data.find((p: any) => p.slug === slug);
          if (found) {
            setProject(found);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error loading project from DB:", error);
      }

      // Fallback to static mock data
      const mock = projectsData[slug];
      setProject(mock || null);
      setLoading(false);
    }

    if (slug) {
      loadProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-gray-400">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
                Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Projects
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            {project.coverImage && (
              <div className="relative w-full h-[350px] md:h-[550px] rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl flex items-center justify-center bg-black">
                {/* Blurred ambient background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-105"
                  style={{ backgroundImage: `url(${project.coverImage})` }}
                />
                {/* Sharp fully-visible cover image */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="relative z-10 max-w-full max-h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-20 pointer-events-none" />
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6">{project.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 flex items-center gap-2"
                >
                  <Github size={20} />
                  View Code
                </a>
              )}
              {(project.demoUrl || (project.images && project.images.length > 0)) && (
                <Link
                  href={project.images && project.images.length > 0 ? `/projects/${slug}/live-demo` : project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full transition-all duration-200 flex items-center gap-2"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={16} />
              <span>{project.date}</span>
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-12">
            <Section title="Problem Statement" content={project.problem} />
            <Section title="Solution" content={project.solution} />
            <Section title="Architecture" content={project.architecture} />

            {/* Project Gallery & Media (Videos Only) */}
            {project.videos && project.videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Project Gallery & Media</h2>

                {/* Videos Grid */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-4">Video Demos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.videos.map((vid: any, idx: number) => {
                      const isEmbed = vid.url.includes("youtube.com/embed") || vid.url.includes("player.vimeo.com");
                      return (
                        <div key={vid.id || idx} className="rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video relative flex flex-col justify-between">
                          <div className="flex-1 min-h-[200px]">
                            {isEmbed ? (
                              <iframe
                                src={vid.url}
                                title={vid.caption || "Demo video"}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={vid.url}
                                controls
                                className="w-full h-full"
                              />
                            )}
                          </div>
                          {vid.caption && (
                            <div className="bg-black/60 backdrop-blur-sm p-3 border-t border-white/10">
                              <p className="text-sm text-gray-300">{vid.caption}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
            
            {project.features && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-3xl font-bold mb-6">Key Features</h2>
                <ul className="space-y-3">
                  {(Array.isArray(project.features)
                    ? project.features
                    : typeof project.features === 'string'
                      ? project.features.split(',').map((f: string) => f.trim()).filter(Boolean)
                      : []
                  ).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <Section title="Challenges" content={project.challenges} />
            <Section title="Learnings" content={project.learnings} />
            <Section title="Results" content={project.results} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
    >
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{content}</p>
    </motion.div>
  );
}
