import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Plus, RotateCcw, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  customBookId: '', bookName: '', author: '', isbn: '',
  category: 'Engineering', language: 'English', publisher: '',
  edition: '', publicationYear: new Date().getFullYear(),
  pages: '', price: '', status: 'Available', quantity: 1,
  rack: '', position: '', description: ''
};

const AddBook = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['Engineering','Science','Arts','Commerce','Fiction','Reference']);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNextBookId = async () => {
    try {
      const { data } = await api.get('/books/next-id');
      setFormData(prev => ({ ...prev, customBookId: data.nextId }));
    } catch { toast.error('Failed to auto-generate Book ID'); }
  };

  useEffect(() => { fetchNextBookId(); }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory(''); setShowAddCategory(false);
      toast.success('Category added');
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM); setCoverFile(null); setCoverPreview('');
    fetchNextBookId();
  };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const { data: created } = await api.post('/books', { ...formData, availableCopies: formData.quantity });
      if (coverFile) {
        const fd = new FormData(); fd.append('photo', coverFile);
        await api.post(`/uploads/photo/books/${created.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success('Book saved successfully!');
      handleReset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><BookOpen size={24} /></div>
            Add Book Details
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Please fill all the required details marked with * to proceed
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/library/management/Availablebooks')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <Eye size={18} />
          View All Books
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
            Please make sure that the ISBN is unique and correct.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Form fields — 3 columns */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Book ID *</label>
                <input type="text" name="customBookId" required readOnly value={formData.customBookId}
                  className="w-full bg-gray-50 text-gray-500 border border-gray-200 rounded-xl py-2 px-3 text-sm font-semibold outline-none cursor-not-allowed" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title *</label>
                <input type="text" name="bookName" required placeholder="Enter book title" value={formData.bookName} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Author *</label>
                <input type="text" name="author" required placeholder="Enter author name" value={formData.author} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">ISBN *</label>
                <input type="text" name="isbn" required placeholder="Enter ISBN number" value={formData.isbn} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category *</label>
                <div className="flex gap-2">
                  <select name="category" required value={formData.category} onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowAddCategory(!showAddCategory)}
                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl border border-indigo-100 transition-all shrink-0">
                    <Plus size={18} />
                  </button>
                </div>
                {showAddCategory && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 z-20 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-800">Add New Category</h4>
                      <button type="button" onClick={() => setShowAddCategory(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                    </div>
                    <input type="text" placeholder="e.g. Mathematics" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl py-1.5 px-3 text-xs outline-none focus:border-indigo-500" />
                    <button type="button" onClick={handleAddCategory}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all">Save Category</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Language *</label>
                <select name="language" required value={formData.language} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 cursor-pointer">
                  {['English','Tamil','Hindi','Sanskrit','French','Spanish','German'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Publisher *</label>
                <input type="text" name="publisher" required placeholder="Enter publisher" value={formData.publisher} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Edition</label>
                <input type="text" name="edition" placeholder="e.g. 1st Edition" value={formData.edition} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Publication Year</label>
                <input type="number" name="publicationYear" min="1900" max={new Date().getFullYear()+1} value={formData.publicationYear} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Number of Pages</label>
                <input type="number" name="pages" min="1" placeholder="Enter page count" value={formData.pages} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Price *</label>
                <input type="number" name="price" required min="0" step="0.01" placeholder="Enter price" value={formData.price} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Status *</label>
                <select name="status" required value={formData.status} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 cursor-pointer">
                  {['Available','Reference Only','Reserved','Lost','Damaged'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Quantity *</label>
                <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Rack</label>
                <input type="text" name="rack" placeholder="e.g. R1" value={formData.rack} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Position</label>
                <input type="text" name="position" placeholder="e.g. Shelf 3" value={formData.position} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>
            </div>

            {/* Book Cover */}
            <div className="md:col-span-1 flex flex-col items-center">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 w-full text-center">Book Cover</label>
              <div className="relative group w-40 h-56 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden hover:border-indigo-400 transition-all duration-300">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(''); }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer">
                    <Upload size={32} className="text-gray-400 mb-2 group-hover:text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-[11px] font-semibold text-gray-500 text-center group-hover:text-indigo-600">Click to Upload Cover Image</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
            <textarea name="description" rows="4" placeholder="Enter book summary, details, or highlights..."
              value={formData.description} onChange={handleInputChange}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
          <button type="button" onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
            <RotateCcw size={16} /> Reset
          </button>
          <button type="submit" disabled={loading}
            className="w-full sm:w-auto px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-md shadow-indigo-600/10 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? 'Saving...' : 'Save Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
