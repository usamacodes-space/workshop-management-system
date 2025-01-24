const { Enrollment, User, Workshop } = require('../models');

// Enroll a learner in a workshop
// Enroll a learner in a workshop
exports.enrollInWorkshop = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug log
    const { workshop_id } = req.body;
    const user_id = req.user?.userId;  // Correct field name: userId (not user_id)

    if (!user_id) {
      return res.status(400).json({ error: "User ID is missing from the request" });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { user_id, workshop_id },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled in this workshop" });
    }

    const enrollment = await Enrollment.create({ user_id, workshop_id });
    res.status(201).json({ message: "Successfully enrolled in the workshop", enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to enroll in the workshop" });
  }
};


// Get all enrollments for a user
exports.getEnrollmentsByUser = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const enrollments = await Enrollment.findAll({
      where: { user_id },
      include: [
        {
          model: Workshop,
          attributes: ['title', 'start_date', 'end_date'],
        },
      ],
    });

   // Notify the learner
   const learnerNotification = await Notification.create({
    user_id,
    type: 'confirmation',
    message: `You have successfully enrolled in the workshop: ${workshop.title}`,
    read: false,
  });

  // Emit notifications in real-time using Socket.io
  io.emit('receive_notification', mentorNotification);
  io.emit('receive_notification', learnerNotification);

    if (!enrollments.length) {
      return res.status(404).json({ error: 'No enrollments found for this user' });
    }

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};
