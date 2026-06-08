const { Student } = require('./src/models');

async function run() {
  try {
    const student = await Student.findOne({
      where: { registerNumber: 'REG20265001' }
    });
    if (student) {
      console.log('STUDENT_DATA:', JSON.stringify(student.toJSON(), null, 2));
    } else {
      console.log('Student not found');
    }
  } catch (error) {
    console.error('Error querying student:', error);
  } finally {
    process.exit();
  }
}

run();
