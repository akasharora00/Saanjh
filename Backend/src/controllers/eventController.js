import Event from "../models/Event.js";
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      venue,
      date,
      time,
      registrationDeadline,
      maxParticipants,
    } = req.body;

    const poster = req.files && req.files["poster"] ? req.files["poster"][0].path : "";
    const circular = req.files && req.files["circular"] ? req.files["circular"][0].path : "";

    const event = await Event.create({
      title,
      description,
      category,
      department,
      venue,
      date,
      time,
      registrationDeadline,
      maxParticipants,
      poster,
      circular,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email department")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email department")
      .populate(
        "registeredStudents.student",
        "name email department semester"
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredStudents.some(
      (registration) =>
        registration.student.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Check seat availability
    if (event.registeredStudents.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Event is full",
      });
    }

    // Register student
    event.registeredStudents.push({
      student: req.user._id,
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: "Registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRegisteredStudents = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate(
        "registeredStudents.student",
        "name email department semester phone"
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only event creator or admin can view registrations
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      totalStudents: event.registeredStudents.length,
      students: event.registeredStudents,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only creator or admin can delete
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const registered = event.registeredStudents.some(
      (registration) =>
        registration.student.toString() === req.user._id.toString()
    );

    if (!registered) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event",
      });
    }

    event.registeredStudents = event.registeredStudents.filter(
      (registration) =>
        registration.student.toString() !== req.user._id.toString()
    );

    await event.save();

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};