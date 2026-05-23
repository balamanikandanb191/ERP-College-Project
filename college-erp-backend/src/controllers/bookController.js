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
      availableCopies: req.body.quantity, // initially available = quantity
      borrowCount: 0
    });
    res.status(201).json(newBook);
  } catch (error) {
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
