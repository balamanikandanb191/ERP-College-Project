const { BorrowRecord, Book, Student, Staff } = require('../models');
const { Op } = require('sequelize');

exports.getAllBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.findAll({
      include: [
        { model: Book, attributes: ['bookName', 'isbn', 'author', 'coverImage'] },
        { model: Student, attributes: ['fullName', 'registerNumber', 'department'] },
        { model: Staff, attributes: ['fullName', 'staffId', 'department'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Auto mark overdue (rudimentary, can be done via cron job in real app)
    const today = new Date().toISOString().split('T')[0];
    const updatedRecords = [];
    for (let record of records) {
      if (record.status === 'Borrowed' && record.returnDate < today) {
        // Calculate fine: 10 per day
        const diffTime = Math.abs(new Date(today) - new Date(record.returnDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const fine = diffDays * 10;
        await record.update({ status: 'Overdue', fineAmount: fine });
        updatedRecords.push(record);
      } else if (record.status === 'Overdue' && !record.actualReturnDate) {
        const diffTime = Math.abs(new Date(today) - new Date(record.returnDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const fine = diffDays * 10;
        if (record.fineAmount !== fine) {
          await record.update({ fineAmount: fine });
        }
      }
    }

    if (updatedRecords.length > 0) {
      // Re-fetch if updated
      const freshRecords = await BorrowRecord.findAll({
        include: [
          { model: Book, attributes: ['bookName', 'isbn', 'author', 'coverImage'] },
          { model: Student, attributes: ['fullName', 'registerNumber', 'department'] },
          { model: Staff, attributes: ['fullName', 'staffId', 'department'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      return res.json(freshRecords);
    }

    res.json(records);
  } catch (error) {
    console.error('Error fetching borrow records:', error);
    res.status(500).json({ message: 'Server error fetching borrow records' });
  }
};

exports.createBorrowRecord = async (req, res) => {
  try {
    const { bookId, borrowerType, studentId, staffId, borrowDate, returnDate } = req.body;
    
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    const newRecord = await BorrowRecord.create({
      borrowerType,
      studentId: studentId || null,
      staffId: staffId || null,
      bookId,
      borrowDate,
      returnDate,
      status: 'Borrowed'
    });

    // Update book copies and borrowCount
    await book.update({
      availableCopies: book.availableCopies - 1,
      borrowCount: book.borrowCount + 1
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating borrow record:', error);
    res.status(500).json({ message: 'Server error creating borrow record' });
  }
};

exports.updateBorrowRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, fineAmount } = req.body;
    
    const record = await BorrowRecord.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    const wasActive = record.status === 'Borrowed' || record.status === 'Overdue';
    const isReturned = status === 'Returned';

    const updates = { status };
    if (fineAmount !== undefined) updates.fineAmount = fineAmount;

    if (wasActive && isReturned) {
      updates.actualReturnDate = new Date().toISOString().split('T')[0];
      
      // Increment available copies
      const book = await Book.findByPk(record.bookId);
      if (book) {
        await book.update({ availableCopies: book.availableCopies + 1 });
      }
    }

    await record.update(updates);
    res.json(record);
  } catch (error) {
    console.error('Error updating borrow record:', error);
    res.status(500).json({ message: 'Server error updating borrow record' });
  }
};

exports.deleteBorrowRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await BorrowRecord.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (record.status !== 'Returned') {
       const book = await Book.findByPk(record.bookId);
       if (book) {
         await book.update({ availableCopies: book.availableCopies + 1 });
       }
    }

    await record.destroy();
    res.json({ message: 'Record deleted' });
  } catch (error) {
    console.error('Error deleting borrow record:', error);
    res.status(500).json({ message: 'Server error deleting borrow record' });
  }
};
