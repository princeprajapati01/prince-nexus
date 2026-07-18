"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Check,
  Upload,
  X,
  ExternalLink,
  Edit2,
  Save,
  Loader2,
  Mail,
  User,
  Globe,
  Github,
  Linkedin,
  Eye,
  EyeOff
} from "lucide-react";

interface ProjectImage {
  id: string;
  url: string;
  caption?: string | null;
}

interface ProjectVideo {
  id: string;
  url: string;
  caption?: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  features?: string | null;
  challenges?: string | null;
  learnings?: string | null;
  results?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  coverImage?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  images: ProjectImage[];
  videos: ProjectVideo[];
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SettingsMap {
  portfolio_title?: string;
  portfolio_tagline?: string;
  github_url?: string;
  linkedin_url?: string;
  contact_email?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal / Form States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  // Upload/Input states for Project Media mapping
  const [mediaUploadFile, setMediaUploadFile] = useState<File | null>(null);
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaTargetType, setMediaTargetType] = useState<"image" | "video">("image");
  const [videoUrlText, setVideoUrlText] = useState("");

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeMessage, setResumeMessage] = useState({ type: "", text: "" });

  // Settings form states
  const [settingsForm, setSettingsForm] = useState<SettingsMap>({});
  const [settingsMessage, setSettingsMessage] = useState("");

  // Project Form States
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    problem: "",
    solution: "",
    architecture: "",
    features: "",
    challenges: "",
    learnings: "",
    results: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
    coverImage: "",
    featured: false,
    published: true,
    order: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, msgRes, setRes] = await Promise.all([
        fetch("/api/projects?published=false"),
        fetch("/api/contact"),
        fetch("/api/settings")
      ]);
      
      const projData = await projRes.json();
      const msgData = await msgRes.json();
      const setData = await setRes.json();

      if (projData.success) {
        setProjects(projData.data);
      }
      if (msgData.success) {
        setMessages(msgData.data);
      }
      if (setData.success) {
        setSettings(setData.data);
        setSettingsForm(setData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, read: !currentRead } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setSettingsMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsForm })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(settingsForm);
        setSettingsMessage("Settings updated successfully!");
      } else {
        setSettingsMessage("Failed to update settings.");
      }
    } catch (error) {
      console.error(error);
      setSettingsMessage("Error saving settings.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;
    setActionLoading(true);
    setResumeMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("type", "resume");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setResumeMessage({ type: "success", text: "Resume PDF uploaded successfully!" });
        setResumeFile(null);
      } else {
        setResumeMessage({ type: "error", text: data.error || "Upload failed." });
      }
    } catch (e) {
      setResumeMessage({ type: "error", text: "Connection error." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file) return;
    setCoverUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "media");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProjectForm(prev => ({ ...prev, coverImage: data.url }));
      } else {
        alert(data.error || "Failed to upload cover image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...projectForm,
      technologies: projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean),
      order: Number(projectForm.order)
    };

    try {
      const url = isEditingProject && editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";
      const method = isEditingProject ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error(`Server returned status ${res.status}: ${res.statusText}`);
      }

      if (data.success) {
        await fetchData();
        setIsAddingProject(false);
        setIsEditingProject(false);
        setSelectedProject(null);
        setEditingProjectId(null);
      } else {
        alert(data.error || "Failed to save project.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while saving the project.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? All associated media will also be deleted from the database.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        setSelectedProject(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMediaAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setActionLoading(true);

    try {
      let fileUrl = "";

      if (mediaTargetType === "image" && mediaUploadFile) {
        const formData = new FormData();
        formData.append("file", mediaUploadFile);
        formData.append("type", "media");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          alert("Failed to upload image file");
          setActionLoading(false);
          return;
        }
        fileUrl = uploadData.url;
      } else if (mediaTargetType === "video") {
        if (mediaUploadFile) {
          // Upload video file
          const formData = new FormData();
          formData.append("file", mediaUploadFile);
          formData.append("type", "media");

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });
          const uploadData = await uploadRes.json();
          if (!uploadData.success) {
            alert("Failed to upload video file");
            setActionLoading(false);
            return;
          }
          fileUrl = uploadData.url;
        } else {
          // Use link
          fileUrl = videoUrlText;
        }
      }

      if (!fileUrl) {
        alert("Please select a file or provide a video link");
        setActionLoading(false);
        return;
      }

      const mediaUrl = mediaTargetType === "image" ? "/api/project-images" : "/api/project-videos";
      const res = await fetch(mediaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          url: fileUrl,
          caption: mediaCaption
        })
      });

      const data = await res.json();
      if (data.success) {
        // Refresh project list
        await fetchData();
        // Update selected project view
        const updatedProjRes = await fetch(`/api/projects/${selectedProject.id}`);
        const updatedProjData = await updatedProjRes.json();
        if (updatedProjData.success) {
          setSelectedProject(updatedProjData.data);
        }
        setMediaUploadFile(null);
        setVideoUrlText("");
        setMediaCaption("");
      } else {
        alert(data.error || "Failed to add media");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMediaDelete = async (mediaId: string, type: "image" | "video") => {
    if (!confirm("Are you sure you want to delete this media?")) return;
    setActionLoading(true);
    try {
      const endpoint = type === "image" ? "/api/project-images" : "/api/project-videos";
      const res = await fetch(`${endpoint}?id=${mediaId}`, { method: "DELETE" });
      if (res.ok) {
        // Refresh project data
        await fetchData();
        if (selectedProject) {
          const updatedProjRes = await fetch(`/api/projects/${selectedProject.id}`);
          const updatedProjData = await updatedProjRes.json();
          if (updatedProjData.success) {
            setSelectedProject(updatedProjData.data);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const openAddProject = () => {
    setIsEditingProject(false);
    setSelectedProject(null);
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      problem: "",
      solution: "",
      architecture: "",
      features: "",
      challenges: "",
      learnings: "",
      results: "",
      technologies: "",
      githubUrl: "",
      demoUrl: "",
      coverImage: "",
      featured: false,
      published: true,
      order: 0
    });
    setIsAddingProject(true);
  };

  const openEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setIsEditingProject(true);
    setSelectedProject(null); // Keep media management closed while editing
    setProjectForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription || "",
      problem: p.problem || "",
      solution: p.solution || "",
      architecture: p.architecture || "",
      features: p.features || "",
      challenges: p.challenges || "",
      learnings: p.learnings || "",
      results: p.results || "",
      technologies: p.technologies.join(", "),
      githubUrl: p.githubUrl || "",
      demoUrl: p.demoUrl || "",
      coverImage: p.coverImage || "",
      featured: p.featured,
      published: p.published,
      order: p.order
    });
    setIsAddingProject(true);
  };

  // Collect all images/videos across projects for general view
  const allImages = projects.flatMap(p => p.images.map(img => ({ ...img, projectTitle: p.title, projectId: p.id })));
  const allVideos = projects.flatMap(p => p.videos.map(vid => ({ ...vid, projectTitle: p.title, projectId: p.id })));

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "videos", label: "Videos", icon: VideoIcon },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-black/60 backdrop-blur-md border-r border-white/10 fixed z-30">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider">
              PRINCE NEXUS
            </h1>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSelectedProject(null);
                      setIsAddingProject(false);
                      setIsEditingProject(false);
                      setEditingProjectId(null);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg shadow-blue-500/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.id === "messages" && unreadMessagesCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </button>
                );
              })}

              <button 
                onClick={() => window.location.href = "/"}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-8"
              >
                <LogOut size={18} />
                <span>Exit Dashboard</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8 min-h-screen">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-gray-400 font-medium">Fetching portfolio assets...</p>
            </div>
          ) : (
            <div>
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      Dashboard
                    </h2>
                    <p className="text-gray-400 mt-2">Welcome to your content center control panel.</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Total Projects", value: projects.length, color: "from-blue-500 to-cyan-500" },
                      { label: "Media Library Images", value: allImages.length, color: "from-purple-500 to-pink-500" },
                      { label: "Embedded Videos", value: allVideos.length, color: "from-green-500 to-teal-500" },
                      { label: "Contact Inquiries", value: messages.length, color: "from-orange-500 to-red-500" },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-md"
                      >
                        <div className={`text-4xl font-extrabold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-gray-400 text-sm font-semibold tracking-wide uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Activity & System Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MessageSquare size={18} className="text-blue-400" />
                        Recent Messages
                      </h3>
                      <div className="space-y-4">
                        {messages.slice(0, 3).length === 0 ? (
                          <p className="text-gray-500 text-sm">No recent messages.</p>
                        ) : (
                          messages.slice(0, 3).map(msg => (
                            <div key={msg.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                              <div className="flex justify-between font-semibold">
                                <span className={msg.read ? "text-gray-400" : "text-blue-400 font-bold"}>
                                  {msg.name} {!msg.read && "🟢"}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-300 mt-1 line-clamp-2">{msg.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <SettingsIcon size={18} className="text-purple-400" />
                          Platform Config
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-gray-500">Portfolio Title:</span>
                            <span>{settings.portfolio_title || "PRINCE NEXUS"}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-gray-500">Active Email:</span>
                            <span>{settings.contact_email || "Not set"}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-500">Resume Link:</span>
                            <a href="/resume.pdf" target="_blank" className="text-blue-400 flex items-center gap-1 hover:underline">
                              resume.pdf <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === "projects" && !selectedProject && !isAddingProject && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-4xl font-extrabold">Projects</h2>
                      <p className="text-gray-400 mt-1">Manage project logs, cover displays, description items, and media uploads.</p>
                    </div>
                    <button
                      onClick={openAddProject}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-bold flex items-center gap-2 shadow-lg shadow-purple-500/10"
                    >
                      <Plus size={18} />
                      Add Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                      >
                        <div>
                          <div className="relative h-44 bg-gray-800">
                            {proj.coverImage ? (
                              <img
                                src={proj.coverImage}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                No cover image uploaded
                              </div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                                proj.published ? "bg-green-500/80 text-white" : "bg-yellow-500/80 text-black"
                              }`}>
                                {proj.published ? "Live" : "Draft"}
                              </span>
                              {proj.featured && (
                                <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-blue-500/80 text-white">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{proj.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">{proj.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {proj.technologies.slice(0, 4).map(tech => (
                                <span key={tech} className="text-xs px-2 py-0.5 bg-white/10 rounded-md text-gray-300">
                                  {tech}
                                </span>
                              ))}
                              {proj.technologies.length > 4 && (
                                <span className="text-xs px-2 py-0.5 text-gray-500">+{proj.technologies.length - 4} more</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 pt-0 border-t border-white/5 bg-black/20 flex gap-2">
                          <button
                            onClick={() => setSelectedProject(proj)}
                            className="flex-1 py-2 text-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold border border-white/5"
                          >
                            Manage Media ({proj.images.length + proj.videos.length})
                          </button>
                          <button
                            onClick={() => openEditProject(proj)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors border border-blue-500/20"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SPECIFIC PROJECT MEDIA MANAGEMENT */}
              {activeTab === "projects" && selectedProject && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        fetchData();
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm"
                    >
                      ← Back to list
                    </button>
                    <h2 className="text-3xl font-extrabold">
                      Manage Media: <span className="text-blue-400">{selectedProject.title}</span>
                    </h2>
                  </div>

                  {/* Add Media Form */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Upload size={18} className="text-blue-400" />
                      Add Media to Project
                    </h3>
                    <form onSubmit={handleMediaAdd} className="space-y-6">
                      <div className="flex gap-4">
                        {["image", "video"].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setMediaTargetType(type as "image" | "video");
                              setMediaUploadFile(null);
                              setVideoUrlText("");
                            }}
                            className={`flex-1 py-2 border rounded-xl font-semibold uppercase text-xs tracking-wider transition-all ${
                              mediaTargetType === type
                                ? "bg-blue-600/20 border-blue-500 text-blue-300"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            {type} Upload
                          </button>
                        ))}
                      </div>

                      {mediaTargetType === "image" ? (
                        <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center bg-black/20">
                          <ImageIcon size={32} className="text-gray-500 mb-3" />
                          <label className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border border-white/10">
                            Select Photo File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setMediaUploadFile(e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                          {mediaUploadFile && (
                            <p className="text-blue-400 text-sm mt-3 font-semibold flex items-center gap-1.5">
                              <Check size={14} /> {mediaUploadFile.name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center bg-black/20">
                            <VideoIcon size={32} className="text-gray-500 mb-3" />
                            <label className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border border-white/10">
                              Upload Video File
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setMediaUploadFile(e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                            {mediaUploadFile && (
                              <p className="text-blue-400 text-sm mt-3 font-semibold flex items-center gap-1.5">
                                <Check size={14} /> {mediaUploadFile.name}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-center text-xs text-gray-500 font-bold uppercase">OR PROVIDE EMBED/LINK URL</div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-1">Video Link URL</label>
                            <input
                              type="text"
                              value={videoUrlText}
                              onChange={(e) => {
                                setVideoUrlText(e.target.value);
                                if (e.target.value) setMediaUploadFile(null); // clear uploaded file
                              }}
                              placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Caption / Title (Optional)</label>
                        <input
                          type="text"
                          value={mediaCaption}
                          onChange={(e) => setMediaCaption(e.target.value)}
                          placeholder="e.g. Dashboard interface demo"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} /> Add Media...
                          </>
                        ) : (
                          <>
                            <Plus size={18} /> Add to {selectedProject.title}
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Existing Media Galleries */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Images Column */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon size={18} className="text-purple-400" />
                        Project Photos ({selectedProject.images.length})
                      </h3>
                      {selectedProject.images.length === 0 ? (
                        <p className="text-gray-500 text-sm">No photos added yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedProject.images.map(img => (
                            <div key={img.id} className="relative group bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                              <img src={img.url} alt={img.caption || ""} className="w-full h-32 object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                                <button
                                  onClick={() => handleMediaDelete(img.id, "image")}
                                  className="self-end p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <p className="text-xs text-white line-clamp-2">{img.caption || "No caption"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Videos Column */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <VideoIcon size={18} className="text-green-400" />
                        Project Videos ({selectedProject.videos.length})
                      </h3>
                      {selectedProject.videos.length === 0 ? (
                        <p className="text-gray-500 text-sm">No videos added yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedProject.videos.map(vid => (
                            <div key={vid.id} className="relative group bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                              <div className="w-full h-32 bg-black flex items-center justify-center">
                                <VideoIcon size={24} className="text-gray-500" />
                              </div>
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                                <button
                                  onClick={() => handleMediaDelete(vid.id, "video")}
                                  className="self-end p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <div className="text-xs text-white">
                                  <p className="font-semibold truncate">{vid.url}</p>
                                  <p className="mt-1 line-clamp-2 text-gray-300">{vid.caption || "No caption"}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ADD/EDIT PROJECT PANEL */}
              {activeTab === "projects" && isAddingProject && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">{isEditingProject ? "Edit Project" : "Add New Project"}</h2>
                    <button
                      onClick={() => {
                        setIsAddingProject(false);
                        setIsEditingProject(false);
                        setSelectedProject(null);
                        setEditingProjectId(null);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleProjectSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Slug (URL string)</label>
                        <input
                          type="text"
                          required
                          value={projectForm.slug}
                          onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1">Brief Description</label>
                      <textarea
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-1">Long Description</label>
                      <textarea
                        value={projectForm.longDescription}
                        onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Problem Statement</label>
                        <textarea
                          value={projectForm.problem}
                          onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Solution Implemented</label>
                        <textarea
                          value={projectForm.solution}
                          onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Architecture Details</label>
                        <textarea
                          value={projectForm.architecture}
                          onChange={(e) => setProjectForm({ ...projectForm, architecture: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Key Features (Comma separated)</label>
                        <textarea
                          value={projectForm.features}
                          onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                          rows={3}
                          placeholder="e.g. Automated KYC verification, Live stock data analytics, JWT Authentication"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Challenges Faced</label>
                        <textarea
                          value={projectForm.challenges}
                          onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Key Learnings</label>
                        <textarea
                          value={projectForm.learnings}
                          onChange={(e) => setProjectForm({ ...projectForm, learnings: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Project Results</label>
                        <textarea
                          value={projectForm.results}
                          onChange={(e) => setProjectForm({ ...projectForm, results: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Technologies (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Next.js, Python, OpenCV"
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Cover Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. /projects/cover.jpg or upload file"
                            value={projectForm.coverImage}
                            onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                          />
                          <label className="flex items-center justify-center px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-semibold cursor-pointer transition-colors gap-2 shrink-0">
                            {coverUploading ? (
                              <>
                                <Loader2 className="animate-spin" size={16} />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Upload
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={coverUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCoverUpload(file);
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={projectForm.demoUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1">Display Order</label>
                        <input
                          type="number"
                          value={projectForm.order}
                          onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="w-5 h-5 rounded bg-white/5 border-white/10"
                        />
                        <label htmlFor="featured" className="text-sm font-semibold text-gray-400 cursor-pointer">Featured Project</label>
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <input
                          type="checkbox"
                          id="published"
                          checked={projectForm.published}
                          onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                          className="w-5 h-5 rounded bg-white/5 border-white/10"
                        />
                        <label htmlFor="published" className="text-sm font-semibold text-gray-400 cursor-pointer">Published / Public</label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} /> Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} /> Save Project
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* MEDIA TAB (ALL IMAGES) */}
              {activeTab === "media" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-extrabold">All Media Photos</h2>
                    <p className="text-gray-400 mt-1">A consolidated view of all uploaded images associated with your projects.</p>
                  </div>

                  {allImages.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                      No media files have been uploaded yet. Assign files to projects under the Projects tab.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {allImages.map(img => (
                        <div key={img.id} className="relative group bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                          <img src={img.url} alt={img.caption || ""} className="w-full h-44 object-cover" />
                          <div className="p-4 bg-black/40">
                            <span className="text-xs text-blue-400 font-bold block mb-1 uppercase tracking-wider">
                              {img.projectTitle}
                            </span>
                            <p className="text-sm text-white font-medium line-clamp-1">{img.caption || "No caption"}</p>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={async () => {
                                if (confirm("Delete this image?")) {
                                  setActionLoading(true);
                                  await fetch(`/api/project-images?id=${img.id}`, { method: "DELETE" });
                                  await fetchData();
                                  setActionLoading(false);
                                }
                              }}
                              className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* VIDEOS TAB (ALL VIDEOS) */}
              {activeTab === "videos" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-extrabold">All Videos</h2>
                    <p className="text-gray-400 mt-1">A consolidated view of all embedded and uploaded video demo items.</p>
                  </div>

                  {allVideos.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                      No video items have been added yet. Map video assets to specific projects under the Projects tab.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allVideos.map(vid => (
                        <div key={vid.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                          <div className="relative aspect-video bg-black flex items-center justify-center">
                            <VideoIcon size={40} className="text-gray-600" />
                          </div>
                          <div className="p-4 bg-black/30">
                            <span className="text-xs text-blue-400 font-bold block mb-1 uppercase">
                              {vid.projectTitle}
                            </span>
                            <p className="text-sm text-gray-300 font-medium mb-2 truncate">{vid.url}</p>
                            <p className="text-xs text-gray-400 italic">{vid.caption || "No caption added"}</p>
                          </div>
                          <div className="p-4 pt-0 flex justify-end">
                            <button
                              onClick={async () => {
                                if (confirm("Remove this video?")) {
                                  setActionLoading(true);
                                  await fetch(`/api/project-videos?id=${vid.id}`, { method: "DELETE" });
                                  await fetchData();
                                  setActionLoading(false);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-red-500/10"
                            >
                              <Trash2 size={12} /> Delete Video
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* RESUME TAB */}
              {activeTab === "resume" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-4xl font-extrabold">Professional Resume</h2>
                    <p className="text-gray-400 mt-1">Upload and update your curriculum vitae PDF served to recruiters on the homepage.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <form onSubmit={handleResumeUpload} className="space-y-6">
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 text-center">
                        <FileText size={48} className="text-gray-500 mb-4" />
                        <h3 className="text-lg font-bold mb-1">Select Professional Resume</h3>
                        <p className="text-sm text-gray-400 mb-4">Please upload a valid PDF file. Size should not exceed 10MB.</p>
                        
                        <label className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border border-white/10 transition-colors">
                          Choose File
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </label>

                        {resumeFile && (
                          <div className="mt-4 flex items-center gap-1.5 text-blue-400 font-semibold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/10">
                            <Check size={16} />
                            <span>{resumeFile.name}</span>
                          </div>
                        )}
                      </div>

                      {resumeMessage.text && (
                        <div className={`p-4 rounded-xl text-sm border font-medium ${
                          resumeMessage.type === "success"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}>
                          {resumeMessage.text}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={actionLoading || !resumeFile}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} /> Uploading Resume...
                          </>
                        ) : (
                          <>
                            <Upload size={18} /> Upload & Replace
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-2">Current Active Resume</h3>
                    <p className="text-sm text-gray-400 mb-4">Your current active resume is live and downloadable by visitors at: `/resume.pdf`</p>
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <Eye size={16} /> View Current Resume <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === "messages" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-extrabold">Inbox</h2>
                    <p className="text-gray-400 mt-1">Review contact requests and messages submitted by prospective recruiters and clients.</p>
                  </div>

                  {messages.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                      No messages received yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`bg-white/5 border rounded-2xl p-6 shadow-md transition-all duration-200 ${
                            msg.read ? "border-white/10" : "border-blue-500/30 bg-blue-500/5 shadow-blue-500/2"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                            <div>
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                <User size={16} className="text-gray-400" />
                                {msg.name}
                                {!msg.read && (
                                  <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">
                                    New
                                  </span>
                                )}
                              </h3>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-sm text-blue-400 hover:underline flex items-center gap-1.5 mt-1"
                              >
                                <Mail size={14} /> {msg.email}
                              </a>
                            </div>
                            <div className="text-xs text-gray-500 font-medium md:text-right">
                              {new Date(msg.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <div className="p-4 bg-black/40 rounded-xl text-gray-300 text-sm whitespace-pre-wrap border border-white/5 mb-4 leading-relaxed">
                            {msg.message}
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleRead(msg.id, msg.read)}
                              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              {msg.read ? (
                                <>
                                  <EyeOff size={14} /> Mark Unread
                                </>
                              ) : (
                                <>
                                  <Check size={14} className="text-green-400" /> Mark Read
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-4xl font-extrabold">Site Configurations</h2>
                    <p className="text-gray-400 mt-1">Adjust platform titles, tags, social references, and recipient email settings.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                          <Globe size={16} /> Portfolio Website Title
                        </label>
                        <input
                          type="text"
                          value={settingsForm.portfolio_title || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, portfolio_title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                          <FileText size={16} /> Portfolio Hero Tagline
                        </label>
                        <textarea
                          value={settingsForm.portfolio_tagline || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, portfolio_tagline: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                          <Mail size={16} /> Primary Contact Email Address
                        </label>
                        <input
                          type="email"
                          value={settingsForm.contact_email || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                          <Github size={16} /> GitHub Profile Link
                        </label>
                        <input
                          type="url"
                          value={settingsForm.github_url || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, github_url: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                          <Linkedin size={16} /> LinkedIn Profile Link
                        </label>
                        <input
                          type="url"
                          value={settingsForm.linkedin_url || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, linkedin_url: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {settingsMessage && (
                        <div className="p-4 rounded-xl text-sm border font-medium bg-green-500/10 border-green-500/30 text-green-400">
                          {settingsMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} /> Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} /> Save Settings
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
