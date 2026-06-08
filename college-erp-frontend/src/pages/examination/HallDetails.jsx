import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Grid, Layers, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const BLOCKS = ['Main Block', 'Science Block', 'Technology Block', 'Library Block', 'MBA Block'];

const SEED_HALLS = [
  { id: 'hall1', roomNo: 'LH-101', blockName: 'Main Block', rows: 6, cols: 5, capacity: 30, active: true },
  { id: 'hall2', roomNo: 'LH-102', blockName: 'Main Block', rows: 6, cols: 5, capacity: 30, active: true },
  { id: 'hall3', roomNo: 'LH-201', blockName: 'Science Block', rows: 5, cols: 6, capacity: 30, active: true },
  { id: 'hall4', roomNo: 'LH-202', blockName: 'Science Block', rows: 5, cols: 6, capacity: 30, active: true },
  { id: 'hall5', roomNo: 'AUD-A', blockName: 'Technology Block', rows: 10, cols: 8, capacity: 80, active: true },
];

const HallDetails = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editing, setEditing] = useState(null);
  const [selectedHallForPreview, setSelectedHallForPreview] = useState(null);
  const [form, setForm] = useState({
    roomNo: '',
    blockName: 'Main Block',
    rows: 6,
    cols: 5,
    active: true
  });

  const [previewDirection, setPreviewDirection] = useState('parallel'); // 'parallel' or 'vertical'
  const [activeStep, setActiveStep] = useState(0);
  const [listActiveStep, setListActiveStep] = useState(0);

  useEffect(() => {
    const totalSeats = form.rows * form.cols;
    if (totalSeats <= 0) return;
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % totalSeats);
    }, 450);
    return () => clearInterval(interval);
  }, [form.rows, form.cols, previewDirection]);

  useEffect(() => {
    if (!selectedHallForPreview) return;
    const totalSeats = selectedHallForPreview.rows * selectedHallForPreview.cols;
    if (totalSeats <= 0) return;
    setListActiveStep(0);
    const interval = setInterval(() => {
      setListActiveStep(prev => (prev + 1) % totalSeats);
    }, 500);
    return () => clearInterval(interval);
  }, [selectedHallForPreview]);

  const fetchHalls = async () => {
    try {
      const { data } = await api.get('/masters/exam_hall');
      if (data && data.length > 0) {
        setHalls(data.map(r => ({ ...r.data, id: r.id })));
      } else {
        // Seed first
        const promises = SEED_HALLS.map(s => api.post('/masters/exam_hall', { data: s }));
        const results = await Promise.all(promises);
        setHalls(results.map(r => ({ ...r.data.data, id: r.data.id })));
      }
    } catch (error) {
      console.error('Failed to fetch halls, falling back to local storage:', error);
      const cached = localStorage.getItem('erp_exam_halls');
      if (cached) {
        setHalls(JSON.parse(cached));
      } else {
        setHalls(SEED_HALLS);
        localStorage.setItem('erp_exam_halls', JSON.stringify(SEED_HALLS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const saveToCache = (updatedList) => {
    localStorage.setItem('erp_exam_halls', JSON.stringify(updatedList));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.roomNo.trim()) {
      toast.error('Room number is required');
      return;
    }
    const capacity = form.rows * form.cols;
    const dataPayload = {
      ...form,
      capacity
    };

    try {
      if (editing) {
        await api.put(`/masters/exam_hall/${editing.id}`, { data: dataPayload });
        const updated = halls.map(h => h.id === editing.id ? { ...h, ...dataPayload } : h);
        setHalls(updated);
        saveToCache(updated);
        toast.success('Exam Hall details updated successfully!');
      } else {
        const { data } = await api.post('/masters/exam_hall', { data: dataPayload });
        const updated = [{ id: data.id, ...dataPayload }, ...halls];
        setHalls(updated);
        saveToCache(updated);
        toast.success('Exam Hall created successfully!');
      }
      setViewMode('list');
      setEditing(null);
    } catch (err) {
      console.error(err);
      const mockId = editing ? editing.id : `hall-${Date.now()}`;
      const mockRecord = { id: mockId, ...dataPayload };
      let updated;
      if (editing) {
        updated = halls.map(h => h.id === editing.id ? mockRecord : h);
      } else {
        updated = [mockRecord, ...halls];
      }
      setHalls(updated);
      saveToCache(updated);
      toast.success(editing ? 'Updated locally (Offline Mode)' : 'Added locally (Offline Mode)');
      setViewMode('list');
      setEditing(null);
    }
  };

  const handleEdit = (hall) => {
    setEditing(hall);
    setForm({
      roomNo: hall.roomNo,
      blockName: hall.blockName,
      rows: hall.rows,
      cols: hall.cols,
      active: hall.active
    });
    setViewMode('form');
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        if (!id.startsWith('hall-') && id.length > 5) {
          await api.delete(`/masters/exam_hall/${id}`);
        }
        const updated = halls.filter(h => h.id !== id);
        setHalls(updated);
        saveToCache(updated);
        if (selectedHallForPreview?.id === id) setSelectedHallForPreview(null);
        toast.success('Exam Hall deleted.');
      } catch (err) {
        const updated = halls.filter(h => h.id !== id);
        setHalls(updated);
        saveToCache(updated);
        if (selectedHallForPreview?.id === id) setSelectedHallForPreview(null);
        toast.success('Deleted locally (Offline Mode).');
      }
    }, 'Are you sure you want to delete this Exam Hall?');
  };

  const filteredHalls = halls.filter(h =>
    h.roomNo.toLowerCase().includes(search.toLowerCase()) &&
    (!selectedBlock || h.blockName === selectedBlock)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {viewMode === 'list' ? (
        <>
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">Data Submission</span>
                <h1 className="text-3xl font-black mt-2">Examination Hall Details</h1>
                <p className="text-blue-200 text-xs font-semibold mt-1">Configure seating configurations, columns, rows and rooms for exams</p>
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ roomNo: '', blockName: 'Main Block', rows: 6, cols: 5, active: true });
                  setViewMode('form');
                }}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> Add Exam Hall
              </button>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-5 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Search Room Numbers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer"
              value={selectedBlock}
              onChange={e => setSelectedBlock(e.target.value)}
            >
              <option value="">All Blocks</option>
              {BLOCKS.map(b => <option key={b}>{b}</option>)}
            </select>
            <span className="text-xs font-bold text-slate-400 ml-auto">{filteredHalls.length} halls configured</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Room No</th>
                      <th className="px-6 py-4">Block</th>
                      <th className="px-6 py-4">Dimensions</th>
                      <th className="px-6 py-4">Capacity</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredHalls.map(hall => (
                      <tr 
                        key={hall.id} 
                        className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${selectedHallForPreview?.id === hall.id ? 'bg-blue-50/30' : ''}`}
                        onClick={() => setSelectedHallForPreview(hall)}
                      >
                        <td className="px-6 py-4 font-bold text-slate-800">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 text-xs font-black">{hall.roomNo}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-semibold text-xs">{hall.blockName}</td>
                        <td className="px-6 py-4 font-semibold text-xs text-slate-500">{hall.rows} R x {hall.cols} C</td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-slate-800">{hall.capacity}</span> <span className="text-slate-400 text-xs">seats</span>
                        </td>
                        <td className="px-6 py-4">
                          {hall.active ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check size={10} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <X size={10} /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(hall)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(hall.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredHalls.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">No exam halls configured</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Layout Preview */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[400px]">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <Grid size={18} className="text-blue-500" /> Room Layout Preview
                </h3>
                <p className="text-slate-400 text-[11px] font-medium mb-6">Select a hall on the left to preview seating layout</p>

                {selectedHallForPreview ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-bold text-slate-500">Hall: </span>
                        <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded ml-1">{selectedHallForPreview.roomNo}</span>
                      </div>
                      <div className="text-slate-500 font-bold">
                        Capacity: <span className="text-slate-800 font-black">{selectedHallForPreview.capacity} Seats</span>
                      </div>
                    </div>

                    {/* Realistic Classroom Simulation */}
                    <div className="relative border border-slate-200 bg-slate-50/50 rounded-2xl p-4 shadow-inner flex gap-3">
                      {/* Left Wall Windows */}
                      <div className="flex flex-col justify-around py-6 text-slate-300">
                        <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                        <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                      </div>

                      {/* Classroom Main Area */}
                      <div className="flex-1 flex flex-col">
                        {/* blackboard / stage */}
                        <div className="flex flex-col items-center gap-1.5 mb-6">
                          <div className="w-2/3 py-1.5 bg-slate-800 border-y-2 border-x-4 border-amber-800 rounded-md shadow-md text-slate-100 text-center font-mono text-[9px] font-black tracking-widest relative">
                            <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-ping" />
                            EXAM STAGE / BOARD
                          </div>
                          {/* Teacher Desk & Chair */}
                          <div className="flex gap-2 items-center">
                            <div className="w-10 h-5 bg-amber-700 border border-amber-800 rounded shadow-sm flex items-center justify-center text-[6px] text-amber-50 font-black">
                              T-DESK
                            </div>
                            <div className="w-3.5 h-3 bg-slate-700 border border-slate-800 rounded-b" />
                          </div>
                        </div>

                        {/* Seating Grid */}
                        <div 
                          className="grid gap-2 border border-dashed border-slate-200 rounded-xl p-3 bg-white overflow-y-auto max-h-[300px]" 
                          style={{ gridTemplateColumns: `repeat(${selectedHallForPreview.cols}, minmax(0, 1fr))` }}
                        >
                          {Array.from({ length: selectedHallForPreview.rows }).map((_, rIndex) => (
                            Array.from({ length: selectedHallForPreview.cols }).map((_, cIndex) => {
                              const seatNumber = rIndex * selectedHallForPreview.cols + cIndex + 1;
                              const isActive = seatNumber === listActiveStep + 1;
                              return (
                                <div 
                                  key={`seat-${rIndex}-${cIndex}`} 
                                  className="flex flex-col items-center justify-center"
                                >
                                  {/* Desk */}
                                  <div 
                                    className={`w-full h-8 rounded border flex flex-col justify-center items-center relative transition-all duration-300 ${
                                      isActive
                                        ? 'bg-blue-600 border-blue-500 text-white scale-105 shadow-md shadow-blue-500/25 font-black z-10'
                                        : 'bg-amber-50 border-amber-200 text-slate-700 hover:bg-amber-100 hover:border-amber-300 shadow-sm'
                                    }`}
                                    title={`Seat R${rIndex + 1}C${cIndex + 1}`}
                                  >
                                    <span className="text-[9px] font-black">{seatNumber}</span>
                                    <span className="text-[5px] opacity-75">R{rIndex + 1}C{cIndex + 1}</span>
                                  </div>
                                  {/* Chair */}
                                  <div className={`w-4 h-1.5 rounded-b transition-colors duration-300 ${
                                    isActive ? 'bg-blue-400' : 'bg-slate-400'
                                  }`} />
                                </div>
                              );
                            })
                          ))}
                        </div>
                      </div>

                      {/* Right Wall with Door */}
                      <div className="flex flex-col justify-between py-6 items-end">
                        <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                        <div className="h-10 w-1.5 bg-amber-500 rounded border border-amber-600 flex items-center justify-center text-[6px] text-white font-black" style={{ writingMode: 'vertical-rl' }} title="Door">
                          DOOR
                        </div>
                        <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Layers size={36} className="text-slate-300 animate-pulse" />
                    <span className="text-xs text-slate-400 font-bold mt-3">Click on a room row to view its visual seating grid</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Form View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{editing ? 'Modify Exam Hall' : 'Add Exam Hall'}</h1>
              <p className="text-slate-500 text-xs font-semibold mt-1">Configure rows, columns, room code and block allocations</p>
            </div>
            <button
              onClick={() => { setViewMode('list'); setEditing(null); }}
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              Back to List
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-2">Room Number *</label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="LH-101"
                      value={form.roomNo}
                      onChange={e => setForm({ ...form, roomNo: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-2">Block Name</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-semibold"
                      value={form.blockName}
                      onChange={e => setForm({ ...form, blockName: e.target.value })}
                    >
                      {BLOCKS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-2">Seating Rows</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      value={form.rows}
                      onChange={e => setForm({ ...form, rows: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-2">Seating Columns</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      value={form.cols}
                      onChange={e => setForm({ ...form, cols: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2 bg-slate-50 rounded-2xl p-4 flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-600">Calculated Seating Capacity</span>
                    <span className="font-black text-blue-600 text-lg">{form.rows * form.cols} Seats</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id="active"
                      className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                      checked={form.active}
                      onChange={e => setForm({ ...form, active: e.target.checked })}
                    />
                    <label htmlFor="active" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                      Room is currently Active and Available for Seat Allocations
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setViewMode('list'); setEditing(null); }}
                    className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all"
                  >
                    {editing ? 'Update Exam Hall' : 'Create Exam Hall'}
                  </button>
                </div>
              </form>

              {/* Seating Flow & Capacity Animation preview */}
              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Allocation Flow Preview</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Choose layout flow to animate capacity path</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setPreviewDirection('parallel')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                        previewDirection === 'parallel'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Parallel (Row-wise)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDirection('vertical')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                        previewDirection === 'vertical'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Vertical (Column-wise)
                    </button>
                  </div>

                  {/* Realistic Classroom Simulation Container */}
                  <div className="relative border border-slate-200 bg-slate-100/50 rounded-2xl p-4 shadow-inner flex gap-3">
                    {/* Left Wall Windows */}
                    <div className="flex flex-col justify-around py-6 text-slate-300">
                      <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                      <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                    </div>

                    {/* Classroom Main Area */}
                    <div className="flex-1 flex flex-col">
                      {/* blackboard / stage */}
                      <div className="flex flex-col items-center gap-1.5 mb-6">
                        <div className="w-2/3 py-1.5 bg-slate-800 border-y-2 border-x-4 border-amber-800 rounded-md shadow-md text-slate-100 text-center font-mono text-[9px] font-black tracking-widest relative">
                          <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-ping" />
                          EXAM STAGE / BOARD
                        </div>
                        {/* Teacher Desk & Chair */}
                        <div className="flex gap-2 items-center">
                          <div className="w-10 h-5 bg-amber-700 border border-amber-800 rounded shadow-sm flex items-center justify-center text-[6px] text-amber-50 font-black">
                            T-DESK
                          </div>
                          <div className="w-3.5 h-3 bg-slate-700 border border-slate-800 rounded-b" />
                        </div>
                      </div>

                      {/* Seating Grid */}
                      {form.rows > 0 && form.cols > 0 ? (
                        <div 
                          className="grid gap-2 border border-dashed border-slate-200 rounded-xl p-3 bg-white overflow-auto max-h-[300px]" 
                          style={{ gridTemplateColumns: `repeat(${form.cols}, minmax(0, 1fr))` }}
                        >
                          {Array.from({ length: form.rows }).map((_, rIndex) => (
                            Array.from({ length: form.cols }).map((_, cIndex) => {
                              const seatNumber = previewDirection === 'vertical'
                                ? cIndex * form.rows + rIndex + 1
                                : rIndex * form.cols + cIndex + 1;
                              const isActive = seatNumber === activeStep + 1;

                              return (
                                <div 
                                  key={`form-seat-${rIndex}-${cIndex}`} 
                                  className="flex flex-col items-center justify-center"
                                >
                                  {/* Desk */}
                                  <div 
                                    className={`w-full h-8 rounded border flex flex-col justify-center items-center relative transition-all duration-300 ${
                                      isActive
                                        ? 'bg-blue-600 border-blue-500 text-white scale-105 shadow-md shadow-blue-500/25 font-black z-10'
                                        : 'bg-amber-50 border-amber-250 text-slate-700 hover:bg-amber-100 hover:border-amber-300 shadow-sm'
                                    }`}
                                    title={`Seat R${rIndex + 1}C${cIndex + 1}`}
                                  >
                                    <span className="text-[9px] font-black">{seatNumber}</span>
                                    <span className="text-[5px] opacity-75">R{rIndex + 1}C{cIndex + 1}</span>
                                  </div>
                                  {/* Chair */}
                                  <div className={`w-4 h-1.5 rounded-b transition-colors duration-300 ${
                                    isActive ? 'bg-blue-400' : 'bg-slate-400'
                                  }`} />
                                </div>
                              );
                            })
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 font-bold py-12">
                          Enter rows and columns to generate layout preview.
                        </div>
                      )}
                    </div>

                    {/* Right Wall with Door */}
                    <div className="flex flex-col justify-between py-6 items-end">
                      <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                      <div className="h-10 w-1.5 bg-amber-500 rounded border border-amber-600 flex items-center justify-center text-[6px] text-white font-black" style={{ writingMode: 'vertical-rl' }} title="Door">
                        DOOR
                      </div>
                      <div className="h-8 w-1 bg-sky-300 border border-sky-400 rounded-full shadow-sm animate-pulse" title="Window" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallDetails;
