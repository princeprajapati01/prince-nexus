"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, GraduationCap, Code, Briefcase } from "lucide-react";

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const timeline = [
    {
      year: "2022 – 2025",
      title: "B.Sc. (CA&IT)",
      institution: "Hemchandracharya North Gujarat University, Patan",
      description: "Acquired solid foundations in computer science, software engineering, databases, and mathematics.",
      icon: GraduationCap,
      status: "completed",
    },
    {
      year: "2025 – Present",
      title: "M.Sc. in Artificial Intelligence & ML",
      institution: "GLS University, Ahmedabad",
      description: "Deep-diving into advanced AI research, Neural Networks, Deep Learning, Computer Vision, and NLP applications.",
      icon: GraduationCap,
      status: "in-progress",
    },
    {
      year: "2026",
      title: "Developed CredMint",
      description: "Designed and built an AI-based loan approval predictor and financial management system.",
      icon: Code,
      status: "completed",
    },
    {
      year: "2026",
      title: "Built NLP Task Classifier",
      description: "Created an NLP pipeline utilizing TF-IDF and Scikit-learn for intelligent task categorization.",
      icon: Code,
      status: "completed",
    },
    {
      year: "2026",
      title: "Building BillVaultAI",
      description: "Developing an OCR-based intelligent document processing system using YOLOv8, PaddleOCR, and FastAPI.",
      icon: Code,
      status: "in-progress",
    },
    {
      year: "Future",
      title: "AI Engineer Role",
      description: "Aiming to build scalable, production-ready AI models and human-centered intelligent software in the industry.",
      icon: Briefcase,
      status: "future",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05,
      },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const getCardVariants = (isEven: boolean) => {
    return {
      hidden: {
        opacity: 0,
        x: isEven ? 30 : -30,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
      },
    };
  };

  return (
    <section id="timeline" ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            My <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Journey</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            From student to AI engineer
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Timeline Line drawing itself */}
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-8 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 origin-top"
          />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  variants={rowVariants}
                  className={`relative flex items-center ${isEven ? "md:flex-row-reverse" : "md:flex-row"
                    } flex-row`}
                >
                  {/* Timeline Node (Circle Icon) */}
                  <motion.div
                    variants={nodeVariants}
                    className="absolute left-8 md:left-1/2 w-8 h-8 -ml-4 md:w-10 md:h-10 md:-ml-5 rounded-full bg-gray-950 border-2 border-purple-500 flex items-center justify-center z-10 shadow-lg shadow-purple-500/20"
                  >
                    <Icon className="text-purple-400 w-4 h-4 md:w-5 md:h-5" />
                  </motion.div>

                  {/* Content Card container */}
                  <div className={`ml-20 md:ml-0 w-full md:w-1/2 ${isEven ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
                    <motion.div
                      variants={getCardVariants(isEven)}
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      className={`bg-white/5 backdrop-blur-sm border ${item.status === "in-progress"
                          ? "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                          : item.status === "future"
                            ? "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                            : "border-white/10"
                        } rounded-2xl p-6 hover:bg-white/10 transition-all duration-300`}
                    >
                      <div className={`flex items-center gap-2 mb-2 text-sm text-gray-400 justify-start ${isEven ? "md:justify-start" : "md:justify-end"
                        }`}>
                        <Calendar size={16} />
                        <span>{item.year}</span>
                        {item.status === "in-progress" && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                            In Progress
                          </span>
                        )}
                        {item.status === "future" && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                            Future
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                      {item.institution && (
                        <p className="text-sm font-semibold text-blue-400 mb-2">{item.institution}</p>
                      )}
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;
