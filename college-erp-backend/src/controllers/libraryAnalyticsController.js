const { Book, BorrowRecord, Student, Staff } = require('../models');
const { Op } = require('sequelize');

exports.getAnalytics = async (req, res) => {
  try {
    const books = await Book.findAll();
    const records = await BorrowRecord.findAll({
      include: [
        { model: Student, attributes: ['fullName'] },
        { model: Staff, attributes: ['fullName'] },
        { model: Book, attributes: ['bookName'] }
      ]
    });

    const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
    const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const borrowedBooks = totalBooks - availableBooks;
    
    const overdueRecords = records.filter(r => r.status === 'Overdue');
    const overdueCount = overdueRecords.length;
    
    const totalInvestment = books.reduce((sum, b) => sum + (b.quantity * b.price), 0);
    const totalFines = records.reduce((sum, r) => sum + (r.fineAmount || 0), 0);

    // Monthly Borrow Activity (Last 6 months)
    const monthlyActivity = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    records.forEach(r => {
      const d = new Date(r.borrowDate);
      const m = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthlyActivity[m]) monthlyActivity[m] = 0;
      monthlyActivity[m]++;
    });
    
    const barChartData = Object.keys(monthlyActivity).map(k => ({
      name: k,
      borrows: monthlyActivity[k]
    })).slice(-6); // Simplified

    // Top Borrowed Books
    const topBooks = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5);

    // Recent Feed
    const recentActivity = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(r => ({
      id: r.id,
      bookName: r.Book?.bookName,
      borrowerName: r.borrowerType === 'Student' ? r.Student?.fullName : r.Staff?.fullName,
      date: r.borrowDate,
      status: r.status
    }));

    res.json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueCount,
      totalInvestment,
      totalFines,
      barChartData,
      topBooks,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching library analytics:', error);
    res.status(500).json({ message: 'Server error fetching library analytics' });
  }
};
