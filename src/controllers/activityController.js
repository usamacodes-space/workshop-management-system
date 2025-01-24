const { Activity, Workshop, Enrollment, Notification } = require('../models');
const { io } = require('../index'); // Import Socket.io instance

// Add an activity to a workshop
exports.addActivity = async (req, res) => {
  try {
    const { title, description, start_time, end_time } = req.body; // Match model fields
    const { workshopId } = req.params;

    // Check if the workshop exists
    const workshop = await Workshop.findByPk(workshopId);
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });

    // Create the activity
    const activity = await Activity.create({
      title, // Match model field
      description,
      start_time, // Match model field
      end_time, // Match model field
      workshop_id: workshopId,
    });

    // Notify enrolled learners about the new activity
    const enrollments = await Enrollment.findAll({ where: { workshop_id: workshopId } });
    const notifications = enrollments.map((enrollment) => ({
      user_id: enrollment.learner_id,
      type: 'activity',
      message: `A new activity "${activity.title}" has been added to the workshop "${workshop.title}".`,
      read: false,
    }));

    await Notification.bulkCreate(notifications);

    // Emit notifications via Socket.io
    notifications.forEach((notification) => io.emit('receive_notification', notification));

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
};


// Update an activity
exports.updateActivity = async (req, res) => {
  try {
    const { workshopId, activityId } = req.params;
    const { title, description, start_time, end_time } = req.body;

    // Ensure the activity exists and belongs to the correct workshop
    const activity = await Activity.findOne({ where: { activity_id: activityId, workshop_id: workshopId } });
    if (!activity) return res.status(404).json({ error: 'Activity not found for this workshop' });

    await activity.update({ title, description, start_time, end_time });

    res.status(200).json({ message: 'Activity updated successfully', activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
};


// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const { workshopId, activityId } = req.params;

    // Ensure the activity exists and belongs to the correct workshop
    const activity = await Activity.findOne({ where: { activity_id: activityId, workshop_id: workshopId } });
    if (!activity) return res.status(404).json({ error: 'Activity not found for this workshop' });

    await activity.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};

// Get all activities for a workshop
exports.listActivities = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const activities = await Activity.findAll({ where: { workshop_id: workshopId } });
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};
