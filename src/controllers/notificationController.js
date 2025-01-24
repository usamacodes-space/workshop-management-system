const { Notification } = require('../models');

// Get all notifications for a user with pagination
exports.getNotificationsByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Make sure the user is authenticated

    // Pagination parameters (default to 10 items per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const notifications = await Notification.findAll({
      where: { user_id },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    if (!notifications.length) {
      return res.status(404).json({ error: 'No notifications found for this user' });
    }

    res.status(200).json({
      page,
      limit,
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    // Ensure the notification exists
    const notification = await Notification.findByPk(notification_id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Prevent unnecessary updates if already marked as read
    if (notification.is_read) {
      return res.status(200).json({ message: 'Notification already marked as read', notification });
    }

    // Mark notification as read
    notification.is_read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Additional method to mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Update all unread notifications for the user
    const [updated] = await Notification.update(
      { is_read: true },
      { where: { user_id, is_read: false } }
    );

    if (updated === 0) {
      return res.status(404).json({ error: 'No unread notifications found for this user' });
    }

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};
