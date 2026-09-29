import LostFound from "../models/LostFound.js";
import { uploadToCloudinary } from "../utils/cloudinaryService.js";


// @desc    Create a lost/found report
// @route   POST /api/lost-found
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { type, itemName, category, description, location, date, phone } = req.body;

    if (!type || !itemName || !category || !description || !location || !date) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadToCloudinary(req.files, "lost-found");
    }

    const report = await LostFound.create({
      owner: req.user._id,
      type,
      itemName,
      category,
      description,
      location,
      date: new Date(date),
      images,
      phone: phone || req.user.phone || "",
    });

    res.status(201).json({
      success: true,
      message: `${type.toUpperCase() === "LOST" ? "Lost" : "Found"} report created successfully.`,
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all lost/found reports (with filters & search)
// @route   GET /api/lost-found
// @access  Private
export const getAllReports = async (req, res) => {
  try {
    const { type, category, status, search, sort } = req.query;
    const queryFilter = {};

    if (type) {
      queryFilter.type = type;
    }
    if (category) {
      queryFilter.category = category;
    }
    if (status) {
      queryFilter.status = status;
    }

    if (search) {
      queryFilter.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    let sortOrder = { createdAt: -1 }; // default newest first
    if (sort === "oldest") {
      sortOrder = { createdAt: 1 };
    }

    const reports = await LostFound.find(queryFilter)
      .populate("owner", "name email profilePic")
      .populate("claimedBy", "name email")
      .sort(sortOrder);

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single report by ID
// @route   GET /api/lost-found/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id)
      .populate("owner", "name email profilePic")
      .populate("claimedBy", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update report details
// @route   PATCH /api/lost-found/:id
// @access  Private
export const updateReport = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Only owner or admin can edit
    if (report.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this report.",
      });
    }

    const { itemName, category, description, location, date, phone } = req.body;

    report.itemName = itemName || report.itemName;
    report.category = category || report.category;
    report.description = description || report.description;
    report.location = location || report.location;
    if (date) {
      report.date = new Date(date);
    }
    report.phone = phone !== undefined ? phone : report.phone;

    if (req.files && req.files.length > 0) {
      report.images = await uploadToCloudinary(req.files, "lost-found");
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully.",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/lost-found/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Only owner or admin can delete
    if (report.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this report.",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Claim / Flag found or lost item
// @route   PATCH /api/lost-found/:id/claim
// @access  Private
export const claimItem = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "This report is already resolved.",
      });
    }

    // A user cannot claim their own post
    if (report.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own reported item.",
      });
    }

    report.claimedBy = req.user._id;
    await report.save();

    res.status(200).json({
      success: true,
      message: report.type === "lost" ? "Reported as found! Owner notified." : "Claim submitted! Owner notified.",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Mark report resolved
// @route   PATCH /api/lost-found/:id/resolve
// @access  Private
export const resolveReport = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Only owner can resolve
    if (report.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can mark this report as resolved.",
      });
    }

    report.status = "resolved";
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report marked as resolved successfully.",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
