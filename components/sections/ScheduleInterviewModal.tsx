"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Mail, Briefcase, User, Video, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleInterviewModal = ({ isOpen, onClose }: ScheduleInterviewModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    dateTime: "",
    type: "Google Meet",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        dateTime: "",
        type: "Google Meet",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to schedule interview.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDateTime = today.toISOString().slice(0, 16);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-lg bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Glowing Accent Top border */}
            <div className="h-[4px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X size={18} />
            </button>

            <div className="p-6 md:p-8">
              {!isSuccess ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Calendar className="text-blue-400" size={24} />
                      Schedule an Interview
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Choose a convenient time to discuss projects, roles, or ideas.
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name & Email Group */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                          Your Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Alex Smith"
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                          Your Email *
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="alex@company.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company (Optional) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Company Name (Optional)
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Date/Time & Interview Type Group */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                          Date & Time *
                        </label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            name="dateTime"
                            required
                            min={minDateTime}
                            value={formData.dateTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors text-sm [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                          Meeting Type *
                        </label>
                        <div className="relative">
                          <Video size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full pl-10 pr-8 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                          >
                            <option value="Google Meet">Google Meet</option>
                            <option value="Zoom">Zoom Meeting</option>
                            <option value="Phone Call">Phone Call</option>
                            <option value="In Person">In Person</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                            <span className="text-[10px] text-gray-400">▼</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message (Optional) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="What would you like to focus on during our discussion? (e.g., job role details, project demo...)"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Scheduling...</span>
                        </>
                      ) : (
                        <>
                          <Calendar size={18} />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mb-4 animate-bounce">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Interview Scheduled!</h3>
                  <p className="text-gray-300 text-sm max-w-sm mx-auto mb-8">
                    Your request has been successfully recorded. Prince will review the request and get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      onClose();
                    }}
                    className="px-8 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Close Window
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleInterviewModal;
