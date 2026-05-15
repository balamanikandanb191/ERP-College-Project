const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Student = require('./Student');
const Staff = require('./Staff');

// Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Student, { as: 'ParentStudent', foreignKey: 'parent_user_id' });
Student.belongsTo(User, { as: 'Parent', foreignKey: 'parent_user_id' });

User.hasOne(Staff, { foreignKey: 'user_id' });
Staff.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Role,
  User,
  Student,
  Staff
};
