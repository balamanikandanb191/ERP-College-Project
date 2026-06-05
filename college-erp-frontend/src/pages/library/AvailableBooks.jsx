import React, { useState, useEffect } from 'react';
import { Search, Filter, Pencil, Trash2, BookOpen, Layers, Globe, DollarSign, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import BookModal from '../../components/BookModal'; // We can use the modal to edit, or we can make a custom Edit popup. Let's build a custom edit modal in-page to support the updated schema!

const AvailableBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    bookName: '',
    author: '',
    isbn: '',
    category: '',
    language: '',
    publisher: '',
    edition: '',
    publicationYear: '',
    pages: '',
    price: '',
    status: '',
    quantity: 1,
    rack: '',
    position: '',
    description: ''
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/books');
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setEditFormData({
      bookName: book.bookName,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      language: book.language || 'English',
      publisher: book.publisher || '',
      edition: book.edition || '',
      publicationYear: book.publicationYear || '',
      pages: book.pages || '',
      price: book.price || '',
      status: book.status || 'Available',
      quantity: book.quantity,
      rack: book.rack || '',
      position: book.position || '',
      description: book.description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${editingBook.id}`, {
        ...editFormData,
        availableCopies: editingBook.availableCopies + (editFormData.quantity - editingBook.quantity)
      });
      toast.success('Book updated successfully');
      setIsEditModalOpen(false);
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchSearch = 
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.customBookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchLanguage = selectedLanguage === 'All' || book.language === selectedLanguage;

    return matchSearch && matchCategory && matchLanguage;
  });

  // Extract unique categories and languages for filters
  const categories = ['All', ...new Set(books.map(b => b.category))];
  const languages = ['All', ...new Set(books.map(b => b.language).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <BookOpen size={24} />
            </div>
            Available Books
          </h1>
          <p className="text-gray-500 text-sm mt-1">Search, view, and manage books in the college inventory</p>
        </div>
        <button
          onClick={() => navigate('/admin/library/management/Addbook')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 self-start sm:self-center"
        >
          <Plus size={18} />
          Add New Book
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by title, author, ID or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option disabled>Filter Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="w-full lg:w-48">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option disabled>Filter Language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-100 font-semibold">
              <tr>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Category / Lang</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Qty (Avail)</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p>Loading inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                    <BookOpen className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-lg font-bold text-gray-700">No books found</p>
                    <p className="text-sm">Try modifying your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000/${book.coverImage}`}
                            alt={book.bookName}
                            className="w-12 h-16 object-cover rounded-lg shadow-sm border border-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400">
                            <BookOpen size={20} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm sm:text-base leading-snug">{book.bookName}</span>
                          <span className="text-gray-500 text-xs mt-0.5">By {book.author}</span>
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded mt-1.5 w-max">
                            ID: {book.customBookId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg w-max flex items-center gap-1">
                          <Layers size={10} />
                          {book.category}
                        </span>
                        {book.language && (
                          <span className="text-gray-400 text-xs flex items-center gap-1 pl-1">
                            <Globe size={12} />
                            {book.language}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        book.status === 'Available' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : book.status === 'Reference Only'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                      {book.rack || book.position ? (
                        <div className="flex flex-col">
                          {book.rack && <span>Rack: {book.rack}</span>}
                          {book.position && <span className="text-gray-400">Pos: {book.position}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-300 font-normal">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{book.availableCopies}</span>
                        <span className="text-[11px] text-gray-400">of {book.quantity} total</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₹{book.price}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                          title="Edit Details"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id, book.bookName)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all"
                          title="Delete Book"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/85 backdrop-blur-md z-10 flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="text-indigo-600" size={24} />
                Edit Book Details
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* TITLE */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title *</label>
                  <input
                    type="text" required
                    value={editFormData.bookName}
                    onChange={(e) => setEditFormData({ ...editFormData, bookName: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* AUTHOR */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Author *</label>
                  <input
                    type="text" required
                    value={editFormData.author}
                    onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">ISBN *</label>
                  <input
                    type="text" required
                    value={editFormData.isbn}
                    onChange={(e) => setEditFormData({ ...editFormData, isbn: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category *</label>
                  <input
                    type="text" required
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* LANGUAGE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Language</label>
                  <input
                    type="text"
                    value={editFormData.language}
                    onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PUBLISHER */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Publisher</label>
                  <input
                    type="text"
                    value={editFormData.publisher}
                    onChange={(e) => setEditFormData({ ...editFormData, publisher: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* EDITION */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Edition</label>
                  <input
                    type="text"
                    value={editFormData.edition}
                    onChange={(e) => setEditFormData({ ...editFormData, edition: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PUBLICATION YEAR */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Publication Year</label>
                  <input
                    type="number"
                    value={editFormData.publicationYear}
                    onChange={(e) => setEditFormData({ ...editFormData, publicationYear: parseInt(e.target.value) || '' })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PAGES */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Pages</label>
                  <input
                    type="number"
                    value={editFormData.pages}
                    onChange={(e) => setEditFormData({ ...editFormData, pages: parseInt(e.target.value) || '' })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* PRICE */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Price *</label>
                  <input
                    type="number" required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) || '' })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Status *</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Reference Only">Reference Only</option>
                    <option value="Lost">Lost</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Quantity *</label>
                  <input
                    type="number" required min="1"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* RACK */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Rack</label>
                  <input
                    type="text"
                    value={editFormData.rack}
                    onChange={(e) => setEditFormData({ ...editFormData, rack: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {/* POSITION */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Position</label>
                  <input
                    type="text"
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableBooks;
