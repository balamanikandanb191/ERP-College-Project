const { Book, BorrowRecord, Student, Staff } = require('../models');

exports.getAnalytics = async (req, res) => {
  try {
    // Fetch all books safely
    const books = await Book.findAll().catch(() => []);

    // Fetch borrow records with associations safely
    let records = [];
    try {
      records = await BorrowRecord.findAll({
        include: [
          { model: Student, as: 'Student', attributes: ['fullName'], required: false },
          { model: Staff,   as: 'Staff',   attributes: ['fullName'], required: false },
          { model: Book,    as: 'Book',    attributes: ['bookName'], required: false }
        ]
      });
    } catch (assocErr) {
      console.warn('BorrowRecord include failed, fetching without includes:', assocErr.message);
      records = await BorrowRecord.findAll().catch(() => []);
    }

    const totalBooks      = books.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const availableBooks  = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
    const borrowedBooks   = Math.max(0, totalBooks - availableBooks);
    const overdueCount    = records.filter(r => r.status === 'Overdue').length;
    const totalInvestment = books.reduce((sum, b) => sum + ((b.quantity || 0) * (b.price || 0)), 0);
    const totalFines      = records.reduce((sum, r) => sum + (r.fineAmount || 0), 0);

    // Monthly Borrow Activity (Last 6 months)
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyActivity = {};
    records.forEach(r => {
      if (!r.borrowDate) return;
      const d   = new Date(r.borrowDate);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyActivity[key] = (monthlyActivity[key] || 0) + 1;
    });

    const barChartData = Object.entries(monthlyActivity)
      .map(([name, borrows]) => ({ name, borrows }))
      .slice(-6);

    // Top Borrowed Books
    const topBooks = [...books]
      .sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0))
      .slice(0, 5);

    // Recent Activity Feed
    const recentActivity = [...records]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(r => ({
        id:           r.id,
        bookName:     r.Book?.bookName || 'Unknown Book',
        borrowerName: r.borrowerType === 'Student'
          ? (r.Student?.fullName || 'Unknown Student')
          : (r.Staff?.fullName   || 'Unknown Staff'),
        date:   r.borrowDate,
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
    // Return safe zero-state instead of a 500 crash
    res.json({
      totalBooks:      0,
      availableBooks:  0,
      borrowedBooks:   0,
      overdueCount:    0,
      totalInvestment: 0,
      totalFines:      0,
      barChartData:    [],
      topBooks:        [],
      recentActivity:  []
    });
  }
};
