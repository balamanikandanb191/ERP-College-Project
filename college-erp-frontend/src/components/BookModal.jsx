import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Upload, Book } from 'lucide-react';
import toast from 'react-hot-toast';

const BookModal = ({ isOpen, onClose, bookData, onSuccess }) => {
  const isEdit = !!bookData;

  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    isbn: '',
    category: 'Engineering',
    quantity: 1,
    price: 0,
    publisher: '',
    description: '',
    coverImage: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isEdit) {
      setFormData({
        bookName: bookData.bookName,
        author: bookData.author,
        isbn: bookData.isbn,
        category: bookData.category,
        quantity: bookData.quantity,
        price: bookData.price,
        publisher: bookData.publisher || '',
        description: bookData.description || '',
        coverImage: bookData.coverImage || ''
      });
    }
  }, [isOpen, isEdit, bookData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/books/${bookData.id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/books', formData);
        toast.success('Book added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Book className="text-primary" size={24} />
            {isEdit ? 'Edit Book Details' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-danger hover:bg-danger/10 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-text-main mb-1.5">Book Name *</label>
              <input
                type="text" required
                value={formData.bookName} onChange={(e) => setFormData({...formData, bookName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Author *</label>
              <input
                type="text" required
                value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">ISBN Number *</label>
              <input
                type="text" required
                value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Category *</label>
              <select
                required
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="Fiction">Fiction</option>
                <option value="Reference">Reference</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Publisher</label>
              <input
                type="text"
                value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Total Quantity *</label>
              <input
                type="number" required min="1"
                value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Price (₹) *</label>
              <input
                type="number" required min="0" step="0.01"
                value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-text-main mb-1.5">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImage} onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-text-main mb-1.5">Description</label>
              <textarea
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-color flex justify-end gap-3">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text-main hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
