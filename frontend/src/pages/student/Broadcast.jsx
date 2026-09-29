import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Plus, MessageSquare, Clock, Inbox, X, Image as ImageIcon } from "lucide-react";
import { getAllPosts, createPost } from "../../api/broadcastApi";
import { getAssetUrl } from "../../utils/url";


const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const getCategoryColor = (category) => {
  switch (category) {
    case "Academic Doubt": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Campus Query": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Study Material": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "General Discussion": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Opportunity": return "bg-pink-500/20 text-pink-400 border-pink-500/30";
    case "Other": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
};

const Broadcast = () => {
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Latest");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "General Discussion",
    description: "",
    attachment: null
  });

  const categories = [
    "All", "Academic Doubt", "Campus Query", "Study Material", 
    "General Discussion", "Opportunity", "Other"
  ];

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (sort === "Oldest") params.sort = "oldest";
      if (sort === "Most Discussed") params.sort = "popular";
      
      const res = await getAllPosts(params);
      const fetchedPosts = Array.isArray(res.data?.posts)
        ? res.data.posts
        : Array.isArray(res.data)
        ? res.data
        : [];
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load discussions. Please try again.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, category, sort]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setModalError(null);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }
      
      await createPost(data);
      setIsModalOpen(false);
      setFormData({ title: "", category: "General Discussion", description: "", attachment: null });
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      setModalError(err.response?.data?.message || "Failed to create post. Please check all fields.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Broadcast</h1>
          <p className="text-slate-400 mt-1">Ask, discuss, and help each other.</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setModalError(null); }}
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-10 pr-10 appearance-none cursor-pointer text-slate-200 outline-none focus:border-blue-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full min-w-[140px] bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 appearance-none cursor-pointer text-slate-200 outline-none focus:border-blue-500 transition-colors"
          >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Discussed">Most Discussed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-900/60 border border-slate-850 rounded-3xl p-6 h-64">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-24"></div>
                  <div className="h-3 bg-slate-800 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-5 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
            <Inbox className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nothing here yet.</h3>
          <p className="text-slate-500 max-w-sm mb-8">Be the first student to start a discussion or ask a question.</p>
          <button 
            onClick={() => { setIsModalOpen(true); setModalError(null); }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={post._id}
              className="bg-slate-900/60 border border-slate-850 rounded-3xl p-6 flex flex-col hover:border-slate-700 transition-colors cursor-pointer group"
              onClick={() => navigate(`/student/broadcast/${post._id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {post.author?.profilePic ? (
                    <img src={getAssetUrl(post.author.profilePic)} alt={post.author?.name} className="w-10 h-10 rounded-full object-cover bg-slate-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
                      {post.author?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{post.author?.name || "Unknown"}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {timeAgo(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{post.title}</h3>
              
              <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                {post.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between text-slate-400 group-hover:text-slate-300">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentCount || 0} Replies</span>
                </div>
                <span className="text-sm font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Discussion →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[28px] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Create Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto space-y-5">
              {modalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 px-4 text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                  placeholder="What do you want to ask or share?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 px-4 appearance-none cursor-pointer text-slate-200 outline-none focus:border-blue-500 transition-colors"
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Details</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 px-4 text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Provide more context or details here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Attachment (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 rounded-xl cursor-pointer transition-colors border border-slate-700 border-dashed">
                    <ImageIcon size={18} />
                    <span className="text-sm font-medium">Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setFormData({...formData, attachment: e.target.files[0]})}
                    />
                  </label>
                  {formData.attachment && (
                    <span className="text-sm text-slate-400 truncate flex-1">{formData.attachment.name}</span>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-2.5 px-6 rounded-xl disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                >
                  {submitLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Broadcast;
