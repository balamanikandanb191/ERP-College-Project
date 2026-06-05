const { Book } = require('../models');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error fetching books' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = await Book.create({
      ...req.body,
      availableCopies: req.body.quantity,
      borrowCount: 0
    });
    res.status(201).json(newBook);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors?.[0]?.path || 'field';
      return res.status(409).json({ message: `A book with this ${field} already exists. Please use a unique value.` });
    }
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error creating book' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // adjust availableCopies if quantity changes
    const diff = req.body.quantity - book.quantity;
    const newAvailable = book.availableCopies + diff;

    if (newAvailable < 0) {
      return res.status(400).json({ message: 'Cannot reduce quantity below currently borrowed copies' });
    }

    await book.update({
      ...req.body,
      availableCopies: newAvailable
    });

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error updating book' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    if (book.availableCopies < book.quantity) {
      return res.status(400).json({ message: 'Cannot delete book. Copies are currently borrowed.' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error deleting book' });
  }
};

exports.getNextBookId = async (req, res) => {
  try {
    // Find the book with the highest numeric ID by fetching all and computing max
    const books = await Book.findAll({ attributes: ['customBookId'] });
    let maxNum = 0;
    books.forEach(b => {
      if (b.customBookId) {
        const match = b.customBookId.match(/^BK(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });
    const nextId = `BK${String(maxNum + 1).padStart(3, '0')}`;
    res.json({ nextId });
  } catch (error) {
    console.error('Error generating next book ID:', error);
    res.status(500).json({ message: 'Server error generating next book ID' });
  }
};

