import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, File, Trash2, Download, Eye, AlertCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const DocumentManager = ({ type, data }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('');
  
  const fileInputRef = useRef(null);
  const isStudent = type === 'Student';
  const entityId = data.id;
  const endpointType = isStudent ? 'students' : 'staff';

  const docTypes = isStudent 
    ? ['Aadhaar', 'Transfer Certificate', '10th Marksheet', '12th Marksheet', 'Community Certificate', 'Parent ID']
    : ['Resume', 'Degree Certificate', 'Experience Certificate', 'Aadhaar/PAN', 'Joining Documents'];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/uploads/document/${endpointType}/${entityId}`);
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Fetch documents error:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchDocuments();
    }
  }, [entityId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!documentType) {
      toast.error('Please select a document type first');
      return;
    }

    // Validate type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, PNG, and WEBP files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const toastId = toast.loading('Uploading document...');
      
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      await api.post(`/uploads/document/${endpointType}/${entityId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Document uploaded successfully', { id: toastId });
      setDocumentType('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    confirmDelete(async () => {
      try {
        await api.delete(`/uploads/document/${endpointType}/${docId}`);
        setDocuments(prev => prev.filter(d => d.id !== docId));
        toast.success('Document deleted');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }, 'Are you sure you want to delete this document?');
  };

  const handleDownload = async (doc) => {
    const fullUrl = `http://localhost:5000/${doc.filePath}`;
    try {
      // In a real scenario, downloading via a link is simpler, but for authenticated API we fetch the blob.
      const response = await api.get(fullUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // If fetching fails via API due to it being static, fallback to standard link download
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = doc.fileName;
      link.target = "_blank";
      link.click();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* Upload Section */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Upload size={16} className="text-indigo-500"/> Upload Document
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Document Type</label>
            <select 
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select type...</option>
              {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf, image/jpeg, image/png, image/webp"
            />
            <button
              onClick={() => {
                if (!documentType) toast.error('Select document type first');
                else fileInputRef.current?.click();
              }}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : <><Upload size={16} /> Choose File</>}
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><AlertCircle size={12} /> Max size: 10MB. Allowed: PDF, JPG, PNG, WEBP.</p>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
          <FileText size={16} className="text-indigo-500"/> Uploaded Documents
        </h3>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <FileText size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500 font-medium">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => {
              const isPdf = doc.mimeType === 'application/pdf';
              return (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg ${isPdf ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                      {isPdf ? <FileText size={20} /> : <ImageIcon size={20} />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{doc.documentType}</h4>
                      <p className="text-xs text-slate-500 truncate" title={doc.fileName}>{doc.fileName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDownload(doc)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download/View">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default DocumentManager;
