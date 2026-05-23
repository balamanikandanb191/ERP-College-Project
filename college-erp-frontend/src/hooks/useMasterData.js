import { useState, useEffect } from 'react';
import api from '../services/api';

export const useMasterData = (type, seedData = []) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const { data } = await api.get(`/masters/${type}`);
      if (data && data.length > 0) {
        setRecords(data.map(r => ({ id: r.id, ...r.data })));
      } else {
        const promises = seedData.map(s => api.post(`/masters/${type}`, { data: s }));
        const results = await Promise.all(promises);
        setRecords(results.map(r => ({ id: r.data.id, ...r.data.data })));
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} records, falling back to localStorage:`, error);
      try {
        const c = localStorage.getItem(`erp_${type}`);
        if (c) {
          setRecords(JSON.parse(c));
        } else {
          setRecords(seedData);
          localStorage.setItem(`erp_${type}`, JSON.stringify(seedData));
        }
      } catch (err) {
        setRecords(seedData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [type]);

  const addRecord = async (form) => {
    try {
      const { data } = await api.post(`/masters/${type}`, { data: form });
      const updated = [{ id: data.id, ...form }, ...records];
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      return { success: true, id: data.id };
    } catch (error) {
      console.error(error);
      const tempId = `${type}-${Date.now()}`;
      const updated = [{ id: tempId, ...form }, ...records];
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      return { success: true, id: tempId, localOnly: true };
    }
  };

  const updateRecord = async (id, form) => {
    try {
      if (id.includes('-') && !id.startsWith(type)) {
        await api.put(`/masters/${type}/${id}`, { data: form });
      }
      const updated = records.map(r => r.id === id ? { ...r, ...form } : r);
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error(error);
      const updated = records.map(r => r.id === id ? { ...r, ...form } : r);
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      return { success: true, localOnly: true };
    }
  };

  const deleteRecord = async (id) => {
    try {
      if (id.includes('-') && !id.startsWith(type)) {
        await api.delete(`/masters/${type}/${id}`);
      }
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error(error);
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem(`erp_${type}`, JSON.stringify(updated));
      return { success: true, localOnly: true };
    }
  };

  return {
    records,
    setRecords,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    refresh: fetchRecords
  };
};
