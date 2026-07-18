"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Loader2,
  Maximize2
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Fallback project details with placeholder screenshots for offline/dev testing
const fallbackProjectsData: { [key: string]: any } = {
  billvaultai: {
    title: "BillVaultAI",
    description: "AI-powered Intelligent Document Processing platform that extracts and analyzes invoice data using OCR, Computer Vision, and automation workflows.",
    demoUrl: "https://billvaultai.com",
    images: [
      { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", caption: "BillVaultAI Intelligent Document Classifier Dashboard" },
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", caption: "OCR Recognition Engine Monitoring and Node Stats" },
      { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", caption: "Invoice Upload & Automated Layout Parsing Pipeline" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", caption: "FastAPI Backend API Logs and Endpoint Latency Overview" },
      { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", caption: "Custom YOLO Layout Analysis Model Weights Configurator" },
      { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", caption: "Text Extraction Pipeline & Entity Extraction Validation" },
      { url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80", caption: "Intelligent Batch Document Processor Workflow" },
      { url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80", caption: "Next.js Admin Analytics Panel with OCR Metrics" }
    ]
  },
  credmint: {
    title: "CredMint",
    description: "AI-Based Loan and Smart Financial Management System that helps users manage finances, track loans, and make informed financial decisions.",
    demoUrl: "https://credmint.com",
    images: [
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", caption: "CredMint Main Financial Analytics & Income Tracking Dashboard" },
      { url: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80", caption: "Mobile Responsive Portal for Instant Credit Score Monitoring" },
      { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", caption: "Smart Savings Planner & Spending Habits Analysis Chart" },
      { url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80", caption: "AI Loan Eligibility Predictor with Underwriting Rules Engine" },
      { url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80", caption: "Multi-loan Outstanding Balance Tracking with Auto-reminders" },
      { url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80", caption: "Investment Portfolio Allocation and Yield Optimizations" },
      { url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80", caption: "Interactive Budget Forecasting and Goal Projection Canvas" },
      { url: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=800&q=80", caption: "Bank Account Integration and Transaction Categorization Portal" }
    ]
  },
  "task-classification": {
    title: "Task Classification System",
    description: "Machine Learning and NLP-based system that classifies user tasks into categories such as Work, Personal, and Health using TF-IDF and Scikit-learn.",
    demoUrl: null,
    images: [
      { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", caption: "Scikit-Learn Classifier Training Runs & Loss Curve Monitor" },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", caption: "Text Preprocessing & TF-IDF Tokenizer Pipeline Logs" },
      { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", caption: "Flask API Web Endpoint for Automated Real-time Predictions" },
      { url: "https://images.unsplash.com/photo-1484417894907-623942c8ea29?auto=format&fit=crop&w=800&q=80", caption: "Consolidated Metrics, Confusion Matrix, and Prediction Accuracy Report" }
    ]
  }
};

export default function LiveDemoGalleryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.data) {
          const found = data.data.find((p: any) => p.slug === slug);
          if (found) {
            // Keep database content, but if it has no images, fallback to default placeholders for demonstration
            const dbImages = found.images || [];
            const mergedProject = {
              ...found,
              images: dbImages.length > 0 ? dbImages : (fallbackProjectsData[slug]?.images || [])
            };
            setProject(mergedProject);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error loading project from DB:", error);
      }

      // Fallback to static mock data
      const mock = fallbackProjectsData[slug];
      setProject(mock || null);
      setLoading(false);
    }

    if (slug) {
      loadProject();
    }
  }, [slug]);

  // Handle Keyboard Navigation in Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, activeIndex, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-gray-400">Loading interactive preview...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Preview Not Found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setZoomLevel(1);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset"; // Restore scrolling
  };

  const handleNext = () => {
    setZoomLevel(1);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  // Group images for Column Creative Grid Layout
  const col1: any[] = [];
  const col2: any[] = [];
  const col3Wide: any[] = [];
  const col3Sub: any[] = [];

  images.forEach((img: any, idx: number) => {
    const item = { ...img, originalIndex: idx };
    if (idx === 0) col1.push({ ...item, heightClass: "h-[220px]" });
    else if (idx === 1) col1.push({ ...item, heightClass: "h-[350px]" });
    else if (idx === 2) col2.push({ ...item, heightClass: "h-[160px]" });
    else if (idx === 3) col2.push({ ...item, heightClass: "h-[220px]" });
    else if (idx === 4) col2.push({ ...item, heightClass: "h-[160px]" });
    else if (idx === 5) col3Wide.push({ ...item, heightClass: "h-[320px]" });
    else if (idx === 6) col3Sub.push({ ...item, heightClass: "h-[260px]" });
    else if (idx === 7) col3Sub.push({ ...item, heightClass: "h-[260px]" });
    else {
      // Distribute remaining images evenly
      const colIdx = idx % 3;
      if (colIdx === 0) col1.push({ ...item, heightClass: "h-[220px]" });
      else if (colIdx === 1) col2.push({ ...item, heightClass: "h-[220px]" });
      else col3Wide.push({ ...item, heightClass: "h-[220px]" });
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button & Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <Link
                href={`/projects/${slug}`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                Back to Details
              </Link>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
                {project.title} — Live Demo
              </h1>
              <p className="text-gray-400 text-lg max-w-3xl">
                Explore the interactive preview screens, design workflow layouts, and features of the system.
              </p>
            </div>
            {project.demoUrl && (
              <div className="flex-shrink-0">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <ExternalLink size={18} />
                  Visit Live Site
                </a>
              </div>
            )}
          </div>

          {/* Grid Layout Selection */}
          {images.length === 0 ? (
            <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm max-w-2xl mx-auto">
              <Eye className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-2">No Preview Screenshots</h3>
              <p className="text-gray-400 mb-6">There are currently no uploaded screenshots for this project.</p>
              <Link 
                href={`/projects/${slug}`}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors"
              >
                Back to Project Details
              </Link>
            </div>
          ) : images.length === 1 ? (
            // 1 Image Grid
            <div className="max-w-4xl mx-auto">
              <div 
                onClick={() => openLightbox(0)} 
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-2xl aspect-video"
              >
                <img 
                  src={images[0].url} 
                  alt={images[0].caption || ""} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                    <Maximize2 size={24} />
                  </div>
                </div>
                {images[0].caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                    <p className="text-base text-gray-200">{images[0].caption}</p>
                  </div>
                )}
              </div>
            </div>
          ) : images.length === 2 ? (
            // 2 Images Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {images.map((img: any, idx: number) => (
                <div 
                  key={img.id || idx} 
                  onClick={() => openLightbox(idx)} 
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-xl aspect-video h-[320px]"
                >
                  <img 
                    src={img.url} 
                    alt={img.caption || ""} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                      <p className="text-sm text-gray-200">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : images.length === 3 ? (
            // 3 Images Grid
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {images.map((img: any, idx: number) => (
                <div 
                  key={img.id || idx} 
                  onClick={() => openLightbox(idx)} 
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-lg aspect-[4/3] md:h-[280px]"
                >
                  <img 
                    src={img.url} 
                    alt={img.caption || ""} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                      <p className="text-sm text-gray-200">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Creative Collage Masonry Grid (4+ Images)
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="flex flex-col gap-6">
                {col1.map((item: any) => (
                  <GalleryCard key={item.id || item.originalIndex} item={item} onClick={() => openLightbox(item.originalIndex)} />
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-6">
                {col2.map((item: any) => (
                  <GalleryCard key={item.id || item.originalIndex} item={item} onClick={() => openLightbox(item.originalIndex)} />
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-6">
                {col3Wide.map((item: any) => (
                  <GalleryCard key={item.id || item.originalIndex} item={item} onClick={() => openLightbox(item.originalIndex)} />
                ))}
                
                {col3Sub.length > 0 && (
                  <div className={`grid ${col3Sub.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
                    {col3Sub.map((item: any) => (
                      <GalleryCard key={item.id || item.originalIndex} item={item} onClick={() => openLightbox(item.originalIndex)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Top Toolbar */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/60 to-transparent z-10">
              <div className="text-sm text-gray-400 font-medium select-none">
                {activeIndex + 1} / {images.length}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <button 
                  onClick={handleZoomOut} 
                  disabled={zoomLevel === 1}
                  className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <button 
                  onClick={handleZoomIn} 
                  disabled={zoomLevel >= 2.5}
                  className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <div className="w-[1px] h-6 bg-white/20" />
                {/* Close Button */}
                <button 
                  onClick={closeLightbox} 
                  className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white transition-colors border border-white/5"
                  title="Close Gallery"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Central Carousel */}
            <div className="flex-1 relative flex items-center justify-center px-4 md:px-16 overflow-hidden">
              {/* Prev Button */}
              {images.length > 1 && (
                <button 
                  onClick={handlePrev} 
                  className="absolute left-4 md:left-8 p-3 rounded-full bg-black/50 hover:bg-white/10 border border-white/10 text-white hover:text-blue-400 transition-all z-10 hover:scale-105"
                  title="Previous Image"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Active Image */}
              <motion.div 
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="max-h-[75vh] max-w-[85vw] flex items-center justify-center overflow-hidden"
              >
                <img 
                  src={images[activeIndex].url} 
                  alt={images[activeIndex].caption || ""} 
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-h-[75vh] max-w-[85vw] object-contain rounded-lg border border-white/10 shadow-2xl transition-transform duration-200 select-none pointer-events-none"
                />
              </motion.div>

              {/* Next Button */}
              {images.length > 1 && (
                <button 
                  onClick={handleNext} 
                  className="absolute right-4 md:right-8 p-3 rounded-full bg-black/50 hover:bg-white/10 border border-white/10 text-white hover:text-blue-400 transition-all z-10 hover:scale-105"
                  title="Next Image"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Caption bar */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center text-center">
              {images[activeIndex].caption ? (
                <motion.p 
                  key={`caption-${activeIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base text-gray-200 max-w-3xl"
                >
                  {images[activeIndex].caption}
                </motion.p>
              ) : (
                <p className="text-gray-400 text-sm italic">No description provided</p>
              )}
              {zoomLevel > 1 && (
                <span className="mt-2 text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 animate-pulse">
                  Zoomed {zoomLevel}x
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Reusable Creative Card Component
function GalleryCard({ item, onClick }: { item: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-lg transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/15 ${item.heightClass} w-full`}
    >
      <img
        src={item.url}
        alt={item.caption || ""}
        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
      />
      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
          <Maximize2 size={20} />
        </div>
      </div>
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <p className="text-sm text-gray-200 line-clamp-2">{item.caption}</p>
        </div>
      )}
    </div>
  );
}
