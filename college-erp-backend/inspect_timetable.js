const { MasterRecord } = require('./src/models');

async function run() {
  try {
    const records = await MasterRecord.findAll({
      where: { type: 'exam_timetable' }
    });
    console.log('TIMETABLES:', JSON.stringify(records.map(r => ({ id: r.id, ...r.data })), null, 2));
  } catch (error) {
    console.error('Error querying timetables:', error);
  } finally {
    process.exit();
  }
}

run();
