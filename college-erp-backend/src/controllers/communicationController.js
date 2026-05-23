const { Announcement, Event, Holiday, Notification, AnnouncementRead, AcademicEvent, User, Student, Staff } = require('../models');
const { Op } = require('sequelize');

exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      authorId: req.user?.id
    });

    // Create Academic Calendar Event if applicable
    if (req.body.category === 'Holidays' || req.body.category === 'Events') {
      await AcademicEvent.create({
        title: req.body.title,
        startDate: req.body.eventDate || req.body.publishDate,
        type: req.body.category === 'Holidays' ? 'Holiday' : 'Event',
        description: req.body.content
      });
    }

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Create Announcement Error:', error);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const { category, priority, status } = req.query;
    const where = {};
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (status) where.status = status;

    const announcements = await Announcement.findAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['fullName'] }
      ],
      order: [['isPinned', 'DESC'], ['publishDate', 'DESC']]
    });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
};

exports.getAnnouncementAnalytics = async (req, res) => {
  try {
    const total = await Announcement.count();
    const activeEvents = await Event.count({ where: { date: { [Op.gte]: new Date() } } });
    const upcomingHolidays = await Holiday.count({ where: { date: { [Op.gte]: new Date() } } });
    const emergencyAlerts = await Announcement.count({ where: { priority: 'Emergency' } });

    res.json({
      totalAnnouncements: total,
      activeEvents,
      upcomingHolidays,
      emergencyAlerts,
      unreadNotifications: 0, // Mock for now
      scheduledAnnouncements: 0 // Mock for now
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await AcademicEvent.findAll({
      order: [['startDate', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch calendar events' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
};
