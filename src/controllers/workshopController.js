const { Workshop, Activity, Enrollment, User, Notification } = require('../models');
const { io } = require('../index'); // Import Socket.io instance

// Create a workshop
exports.createWorkshop = async (req, res) => {
  try {
    const { title, description, start_date, end_date, location } = req.body;
    const mentorId = req.user.userId; // Extracted from JWT and middleware

    // Log mentorId for debugging
    console.log('Mentor ID:', mentorId);

    const workshop = await Workshop.create({
      title,
      description,
      start_date,
      end_date,
      location,
      mentor_id: mentorId, // Assign mentor_id correctly
    });

    res.status(201).json(workshop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create workshop' });
  }
};

// Update a workshop
exports.updateWorkshop = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { title, description, start_date, end_date, location } = req.body;

    const workshop = await Workshop.findByPk(workshopId);
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });

    await workshop.update({ title, description, start_date, end_date, location });

    // Notify all enrolled learners about the update
    const enrollments = await Enrollment.findAll({ where: { workshop_id: workshopId } });
    const notifications = enrollments.map((enrollment) => ({
      user_id: enrollment.learner_id,
      type: 'update',
      message: `The workshop "${workshop.title}" has been updated. Please check the details.`,
      read: false,
    }));

    await Notification.bulkCreate(notifications);

    // Emit notifications via Socket.io
    notifications.forEach((notification) => io.emit('receive_notification', notification));

    res.status(200).json({ message: 'Workshop updated successfully', workshop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update workshop' });
  }
};

// Delete a workshop
exports.deleteWorkshop = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const workshop = await Workshop.findByPk(workshopId);
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });

    // Notify all enrolled learners about the deletion
    const enrollments = await Enrollment.findAll({ where: { workshop_id: workshopId } });
    const notifications = enrollments.map((enrollment) => ({
      user_id: enrollment.learner_id,
      type: 'deletion',
      message: `The workshop "${workshop.title}" has been canceled.`,
      read: false,
    }));

    await Notification.bulkCreate(notifications);

    // Emit notifications via Socket.io
    notifications.forEach((notification) => io.emit('receive_notification', notification));

    // Delete the workshop and associated activities
    await Activity.destroy({ where: { workshop_id: workshopId } });
    await Enrollment.destroy({ where: { workshop_id: workshopId } });
    await workshop.destroy();

    res.status(204).json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete workshop' });
  }
};

// List all workshops with activities
exports.listWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.findAll({
      include: [{ model: Activity, as: 'Activities' }], // Correct alias
    });
    res.status(200).json(workshops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
};

// Get workshop details by ID
exports.getWorkshopDetails = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const workshop = await Workshop.findByPk(workshopId, {
      include: [{ model: Activity, as: 'Activities' }], // Correct alias
    });
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });

    res.status(200).json(workshop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch workshop details' });
  }
};
