import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Pencil, Trash2, Search, Filter, Plus, Book } from 'lucide-react';
import toast from 'react-hot-toast';
import BookModal from './BookModal';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/books');
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load books', { id: 'book-load-err' });
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Book deleted');
        fetchBooks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleOpenModal = (book = null) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  const filteredData = Array.isArray(books) ? books.filter(book => {
    if (!book) return false;
    const name = (book.bookName || '').toLowerCase();
    const isbn = (book.isbn || '').toLowerCase();
    const author = (book.author || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || isbn.includes(search) || author.includes(search);
  }) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border-color flex flex-col lg:flex-row gap-4 justify-between items-center bg-gray-50/50 rounded-t-2xl">
        <div className="relative w-full lg:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by book name, author, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border-color rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold px-4 py-2.5 border border-border-color bg-white rounded-xl shadow-sm w-full lg:w-auto">
            <Filter size={16} />
            Filters
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-dark transition-colors text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm w-full lg:w-auto"
          >
            <Plus size={18} />
            Add Book
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/80 text-text-muted border-b border-border-color">
            <tr>
              <th className="px-6 py-4 font-semibold">Book Info</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Availability</th>
              <th className="px-6 py-4 font-semibold">Price/Value</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                  <div className="animate-pulse flex flex-col items-center gap-2">
                    <Book className="text-gray-300" size={32} />
                    <p>Loading inventory...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                  <Book className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-lg font-medium text-text-main">No books found.</p>
                  <p className="text-sm">Try adjusting your search or add a new book.</p>
                </td>
              </tr>
            ) : (
              filteredData.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.bookName} className="w-12 h-16 object-cover rounded shadow-sm border border-border-color" />
                      ) : (
                        <div className="w-12 h-16 bg-gray-100 rounded shadow-sm border border-border-color flex items-center justify-center text-gray-400">
                          <Book size={20} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-text-main text-base">{book.bookName}</span>
                        <span className="text-sm text-text-muted">{book.author}</span>
                        <span className="text-xs text-text-muted mt-1">ISBN: {book.isbn}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">{book.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}></span>
                        <span className="font-semibold text-text-main">{book.availableCopies} available</span>
                      </div>
                      <span className="text-xs text-text-muted ml-4">out of {book.quantity} total</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-text-main font-semibold">₹{book.price}</span>
                      <span className="text-xs text-text-muted">Total: ₹{(book.price * book.quantity).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(book)}
                        className="p-2 text-text-muted hover:text-primary bg-white hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20 shadow-sm"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-2 text-text-muted hover:text-danger bg-white hover:bg-danger/10 rounded-lg transition-colors border border-transparent hover:border-danger/20 shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BookModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setBookToEdit(null); }}
          bookData={bookToEdit}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
};

export default BookTable;
