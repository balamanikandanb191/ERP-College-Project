const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.route('/')
  .get(bookController.getAllBooks)
  .post(requireRole(['Super Admin', 'Admin', 'Staff']), bookController.createBook);

router.get('/next-id', bookController.getNextBookId);

router.route('/:id')
  .put(requireRole(['Super Admin', 'Admin', 'Staff']), bookController.updateBook)
  .delete(requireRole(['Super Admin', 'Admin']), bookController.deleteBook);

module.exports = router;
