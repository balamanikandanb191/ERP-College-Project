const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Announcement = sequelize.define('Announcement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Academic', 'Events', 'Holidays', 'Placement', 'Hostel', 'Emergency'),
      defaultValue: 'Academic'
    },
    priority: {
      type: DataTypes.ENUM('General', 'Important', 'High', 'Emergency'),
      defaultValue: 'General'
    },
    audienceType: {
      type: DataTypes.ENUM('All', 'Department', 'Year', 'Individual', 'Hostel', 'Placement'),
      defaultValue: 'All'
    },
    audienceValue: {
      type: DataTypes.STRING, // e.g. "CSE", "Final Year", "STUD001"
      allowNull: true
    },
    publishDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bannerUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isEmergency: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
      defaultValue: 'Published'
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  });

  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organizer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registrationLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    posterUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General'
    }
  });

  const Holiday = sequelize.define('Holiday', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Government', 'Festival', 'Emergency'),
      defaultValue: 'Government'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'General'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  const AnnouncementRead = sequelize.define('AnnouncementRead', {
    viewedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  const AcademicEvent = sequelize.define('AcademicEvent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('Holiday', 'Exam', 'Event', 'Placement', 'Semester', 'Other'),
      defaultValue: 'Other'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return { Announcement, Event, Holiday, Notification, AnnouncementRead, AcademicEvent };
};
