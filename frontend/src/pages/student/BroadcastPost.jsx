import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Edit3, Trash2, Reply, Send, X, Clock } from "lucide-react";
import { getPostById, updatePost, deletePost, createComment, replyToComment, updateComment, deleteComment } from "../../api/broadcastApi";
import { useAuth } from "../../context/AuthContext";
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

const UserAvatar = ({ user, className = "w-9 h-9" }) => {
  if (user?.profilePic) {
    return <img src={getAssetUrl(user.profilePic)} alt={user?.name} className={`${className} rounded-full object-cover bg-slate-800`} />;
  }
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm`}>
      {user?.name?.charAt(0) || "U"}
    </div>
  );
};

const BroadcastPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: "", category: "", description: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);
  
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [replyContent, setReplyContent] = useState("");
  
  const [editingComment, setEditingComment] = useState(null); // commentId
  const [editCommentContent, setEditCommentContent] = useState("");

  const categories = [
    "Academic Doubt", "Campus Query", "Study Material", 
    "General Discussion", "Opportunity", "Other"
  ];

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await getPostById(id);
      const postObj = res.data?.post || res.data;
      const commentsArr = Array.isArray(res.data?.comments) ? res.data.comments : [];
      setPost({ ...postObj, comments: commentsArr });
      setEditFormData({
        title: postObj.title || "",
        category: postObj.category || "General Discussion",
        description: postObj.description || ""
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Post not found or you don't have permission to view it.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      await updatePost(id, editFormData);
      setEditMode(false);
      fetchPost();
    } catch (err) {
      console.error("Error updating post:", err);
      alert(err.response?.data?.message || "Failed to update post.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        navigate("/student/broadcast");
      } catch (err) {
        console.error("Error deleting post:", err);
        alert(err.response?.data?.message || "Failed to delete post.");
      }
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentSubmitting(true);
    try {
      await createComment(id, newComment);
      setNewComment("");
      fetchPost();
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(err.response?.data?.message || "Failed to post comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleReplyToComment = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      await replyToComment(commentId, replyContent);
      setReplyingTo(null);
      setReplyContent("");
      fetchPost();
    } catch (err) {
      console.error("Error replying to comment:", err);
      alert(err.response?.data?.message || "Failed to reply to comment.");
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    try {
      await updateComment(commentId, editCommentContent);
      setEditingComment(null);
      setEditCommentContent("");
      fetchPost();
    } catch (err) {
      console.error("Error updating comment:", err);
      alert(err.response?.data?.message || "Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await deleteComment(commentId);
        fetchPost();
      } catch (err) {
        console.error("Error deleting comment:", err);
        alert(err.response?.data?.message || "Failed to delete comment.");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto w-full">
        <div className="w-24 h-8 bg-slate-800 rounded-lg animate-pulse mb-8" />
        <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6 animate-pulse">
            <div className="w-12 h-12 bg-slate-800 rounded-full" />
            <div className="space-y-2">
              <div className="w-32 h-4 bg-slate-800 rounded" />
              <div className="w-24 h-3 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="w-3/4 h-8 bg-slate-800 rounded" />
            <div className="w-full h-4 bg-slate-800 rounded" />
            <div className="w-full h-4 bg-slate-800 rounded" />
            <div className="w-5/6 h-4 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
          <X className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error</h3>
        <p className="text-slate-500 max-w-sm mb-8">{error}</p>
        <button 
          onClick={() => navigate("/student/broadcast")}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isAuthor = user && post.author && user._id === post.author._id;

  const topLevelComments = (post.comments || []).filter(c => !c.parentComment);
  const getReplies = (parentId) => (post.comments || []).filter(c => c.parentComment === parentId || (c.parentComment && c.parentComment._id === parentId));

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100 font-sans max-w-4xl mx-auto w-full pb-20">
      <button 
        onClick={() => navigate("/student/broadcast")}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discussions</span>
      </button>

      {/* POST CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 border border-slate-850 rounded-3xl p-6 md:p-8 relative overflow-hidden"
      >
        {editMode ? (
          <form onSubmit={handleUpdatePost} className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Edit3 size={20} className="text-blue-500"/> Edit Discussion</h3>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
              <input
                type="text"
                required
                value={editFormData.title}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
              <select
                value={editFormData.category}
                onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 px-4 appearance-none cursor-pointer text-slate-200 outline-none focus:border-blue-500"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Details</label>
              <textarea
                required
                rows={6}
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSubmitting}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-2.5 px-6 rounded-xl disabled:opacity-70 flex items-center justify-center min-w-[120px]"
              >
                {editSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="flex items-center gap-4">
                <UserAvatar user={post.author} className="w-12 h-12" />
                <div>
                  <h4 className="text-base font-semibold text-slate-200">{post.author?.name || "Unknown"}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(post.createdAt)}
                    {post.createdAt !== post.updatedAt && <span className="italic">(edited)</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 self-start">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md border ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                
                {isAuthor && (
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <button onClick={() => setEditMode(true)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={handleDeletePost} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{post.title}</h1>
            
            <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap mb-6">
              {post.description}
            </div>
            
            {post.attachment && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 max-h-[400px] flex justify-center bg-slate-955/50">
                <img 
                  src={getAssetUrl(post.attachment)} 
                  alt="Attachment" 
                  className="max-h-[400px] object-contain"
                />
              </div>
            )}
            
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center text-slate-400">
              <div className="flex items-center gap-2 font-medium">
                <MessageSquare className="w-5 h-5" />
                <span>{post.comments?.length || 0} Comments</span>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* COMMENTS SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">Discussion</h3>
        
        {/* NEW COMMENT FORM */}
        <form onSubmit={handleCreateComment} className="mb-10 flex gap-4">
          <UserAvatar user={user} className="w-10 h-10 hidden sm:block shrink-0" />
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add to the discussion..."
              className="w-full bg-slate-955/70 border border-slate-800 rounded-2xl py-3 px-4 pr-14 text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500 resize-none min-h-[100px]"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || commentSubmitting}
              className="absolute right-3 bottom-4 p-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all"
            >
              {commentSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* COMMENTS LIST */}
        {post.comments?.length === 0 ? (
          <div className="text-center py-10 text-slate-500 italic">No comments yet. Be the first to reply!</div>
        ) : (
          <div className="space-y-6">
            {topLevelComments.map(comment => (
              <div key={comment._id} className="border-b border-slate-800/60 pb-6 last:border-0">
                <div className="flex gap-4">
                  <UserAvatar user={comment.author} className="w-10 h-10 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-200">{comment.author?.name || "Unknown"}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {timeAgo(comment.createdAt)}</span>
                    </div>
                    
                    {editingComment === comment._id ? (
                      <div className="mt-2">
                        <textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          className="w-full bg-slate-955 border border-slate-700 rounded-xl py-2 px-3 text-slate-200 text-sm outline-none focus:border-blue-500 mb-2 resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateComment(comment._id)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">Save</button>
                          <button onClick={() => setEditingComment(null)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap mt-1">{comment.content}</p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 font-medium transition-colors">
                            <Reply className="w-3.5 h-3.5" /> Reply
                          </button>
                          {user && comment.author && user._id === comment.author._id && (
                            <>
                              <button onClick={() => { setEditingComment(comment._id); setEditCommentContent(comment.content); }} className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors">Edit</button>
                              <button onClick={() => handleDeleteComment(comment._id)} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors">Delete</button>
                            </>
                          )}
                        </div>
                      </>
                    )}

                    {/* REPLY FORM */}
                    {replyingTo === comment._id && (
                      <div className="mt-4 flex gap-3 ml-2">
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full bg-slate-955 border border-slate-700 rounded-xl py-2 px-3 text-slate-200 text-sm outline-none focus:border-blue-500 resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleReplyToComment(comment._id)} disabled={!replyContent.trim()} className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors">Reply</button>
                            <button onClick={() => setReplyingTo(null)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* NESTED REPLIES */}
                {getReplies(comment._id).length > 0 && (
                  <div className="mt-4 space-y-4 ml-8 sm:ml-12 border-l-2 border-slate-800/80 pl-4">
                    {getReplies(comment._id).map(reply => (
                      <div key={reply._id} className="flex gap-3">
                        <UserAvatar user={reply.author} className="w-8 h-8 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-200 text-sm">{reply.author?.name || "Unknown"}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {timeAgo(reply.createdAt)}</span>
                          </div>
                          
                          {editingComment === reply._id ? (
                            <div className="mt-1">
                              <textarea
                                value={editCommentContent}
                                onChange={(e) => setEditCommentContent(e.target.value)}
                                className="w-full bg-slate-955 border border-slate-700 rounded-xl py-2 px-3 text-slate-200 text-sm outline-none focus:border-blue-500 mb-2 resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateComment(reply._id)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">Save</button>
                                <button onClick={() => setEditingComment(null)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-slate-300 text-sm whitespace-pre-wrap">{reply.content}</p>
                              {user && reply.author && user._id === reply.author._id && (
                                <div className="flex items-center gap-3 mt-2">
                                  <button onClick={() => { setEditingComment(reply._id); setEditCommentContent(reply.content); }} className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors">Edit</button>
                                  <button onClick={() => handleDeleteComment(reply._id)} className="text-[11px] text-slate-500 hover:text-red-400 transition-colors">Delete</button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BroadcastPost;
