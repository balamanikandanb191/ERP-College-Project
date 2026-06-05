const sequelize = require('./src/config/database');
const { MasterRecord } = require('./src/models');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Database connection authenticated.');
    
    // Check if master_records table exists
    const [results] = await sequelize.query("SHOW TABLES LIKE 'master_records'");
    if (results.length === 0) {
      console.log("Table 'master_records' does NOT exist!");
    } else {
      console.log("Table 'master_records' exists.");
      const cols = await sequelize.query("DESCRIBE master_records");
      console.log("Columns:", cols[0]);
    }
    
    console.log('Attempting to query MasterRecord...');
    const records = await MasterRecord.findAll({
      where: { type: 'student_register' }
    });
    console.log('Query successful. Found records:', records.length);
  } catch (error) {
    console.error('DIAGNOSTICS ERROR:', error);
  } finally {
    await sequelize.close();
  }
}

check();
