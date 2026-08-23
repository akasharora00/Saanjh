import Note from "../models/Note.js";

export const uploadNote = async (req, res) => {
  try {
    const {
      title,
      subject,
      department,
      semester,
      description,
    } = req.body;

    // Check if PDF is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file.",
      });
    }

    const note = await Note.create({
      title,
      subject,
      department,
      semester,
      description,
      fileUrl: req.file.path.replace(/\\/g, "/"),
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Note Uploaded Successfully",
      note,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      uploadedBy: req.user._id,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("uploadedBy", "name email");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateNote = async (req, res) => {
  try {

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Security check: Only the creator of the note or an admin can update it
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this note.",
      });
    }

    note.title = req.body.title || note.title;
    note.subject = req.body.subject || note.subject;
    note.department = req.body.department || note.department;
    note.semester = req.body.semester || note.semester;
    note.description = req.body.description || note.description;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const deleteNote = async (req, res) => {
  try {

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Security check: Only the creator of the note or an admin can delete it
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note.",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

