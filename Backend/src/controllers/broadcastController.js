import BroadcastPost from "../models/BroadcastPost.js";
import BroadcastComment from "../models/BroadcastComment.js";

export const createPost = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: "Title, category, and description are required." });
    }
    
    let attachment = "";
    if (req.file) {
      attachment = req.file.path.replace(/\\/g, "/");
    }

    const newPost = new BroadcastPost({
      author: req.user._id,
      title,
      category,
      description,
      attachment,
    });

    await newPost.save();
    
    const post = await BroadcastPost.findById(newPost._id).populate("author", "name email profilePic");

    res.status(201).json({ success: true, message: "Post created successfully.", post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let queryFilter = {};

    if (category) {
      queryFilter.category = category;
    }

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "oldest") sortOptions = { createdAt: 1 };
    if (sort === "popular") sortOptions = { commentCount: -1 };

    const posts = await BroadcastPost.find(queryFilter)
      .populate("author", "name email profilePic")
      .sort(sortOptions);

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await BroadcastPost.findById(req.params.id).populate("author", "name email profilePic");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const comments = await BroadcastComment.find({ post: req.params.id })
      .populate("author", "name email profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, post, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await BroadcastPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this post." });
    }

    const { title, category, description } = req.body;
    if (title) post.title = title;
    if (category) post.category = category;
    if (description) post.description = description;

    if (req.file) {
      post.attachment = req.file.path.replace(/\\/g, "/");
    }

    await post.save();

    res.status(200).json({ success: true, message: "Post updated successfully.", post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await BroadcastPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post." });
    }

    await BroadcastComment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required." });
    }

    const post = await BroadcastPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const newComment = new BroadcastComment({
      post: req.params.id,
      author: req.user._id,
      parentComment: null,
      content,
    });

    await newComment.save();
    
    post.commentCount += 1;
    await post.save();

    const comment = await BroadcastComment.findById(newComment._id).populate("author", "name email profilePic");

    res.status(201).json({ success: true, message: "Comment added.", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required." });
    }

    const parentComment = await BroadcastComment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).json({ success: false, message: "Parent comment not found." });
    }

    const post = await BroadcastPost.findById(parentComment.post);
    if (!post) {
      return res.status(404).json({ success: false, message: "Associated post not found." });
    }

    const reply = new BroadcastComment({
      post: parentComment.post,
      author: req.user._id,
      parentComment: req.params.commentId,
      content,
    });

    await reply.save();
    
    post.commentCount += 1;
    await post.save();

    const comment = await BroadcastComment.findById(reply._id).populate("author", "name email profilePic");

    res.status(201).json({ success: true, message: "Reply added.", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await BroadcastComment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this comment." });
    }

    if (content) comment.content = content;
    await comment.save();

    res.status(200).json({ success: true, message: "Comment updated.", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await BroadcastComment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment." });
    }

    const replies = await BroadcastComment.find({ parentComment: comment._id });
    const deleteCount = 1 + replies.length;

    await BroadcastComment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    const post = await BroadcastPost.findById(comment.post);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - deleteCount);
      await post.save();
    }

    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
