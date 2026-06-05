import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useMasterData = (type, seedData = []) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const LS_KEY = `erp_${type}`;

  // ─── Fetch from backend; sync to localStorage ────────────────────────────
  const fetchRecords = useCallback(async () => {
    try {
      const { data } = await api.get(`/masters/${type}`);
      if (Array.isArray(data)) {
        const mapped = data.map(r => ({ ...r.data, id: r.id }));
        setRecords(mapped);
        // Keep localStorage in sync with backend truth
        localStorage.setItem(LS_KEY, JSON.stringify(mapped));
      } else {
        setRecords([]);
        localStorage.setItem(LS_KEY, JSON.stringify([]));
      }
    } catch (error) {
      // Backend unreachable — use localStorage as read-only fallback
      console.error(`[useMasterData] Backend fetch failed for "${type}", using localStorage:`, error);
      try {
        const cached = localStorage.getItem(LS_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          // Only trust records with real backend UUIDs (not temp IDs)
          const trusted = parsed.filter(r => r.id && !String(r.id).startsWith(`${type}-`));
          setRecords(trusted);
        } else {
          setRecords([]);
        }
      } catch {
        setRecords([]);
      }
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ─── Add record ──────────────────────────────────────────────────────────
  const addRecord = async (form) => {
    // Strip large binary fields to keep payload manageable
    const safeForm = { ...form };
    if (safeForm.photoUrl && safeForm.photoUrl.startsWith('data:')) {
      // Store photo indicator but not the full base64 in master_records
      safeForm._hasPhoto = true;
      safeForm.photoUrl = '';
    }

    try {
      const { data } = await api.post(`/masters/${type}`, { data: safeForm });
      const newRecord = { ...safeForm, id: data.id };
      const updated = [newRecord, ...records];
      setRecords(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return { success: true, id: data.id };
    } catch (error) {
      console.error(`[useMasterData] addRecord failed for "${type}":`, error);

      // Save locally with temp ID — warn the user
      const tempId = `${type}-${Date.now()}`;
      const newRecord = { ...safeForm, id: tempId, _localOnly: true };
      const updated = [newRecord, ...records];
      setRecords(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));

      // Show a warning so the user knows the data is only saved locally
      toast('⚠️ Saved locally only. Check your internet/server connection — data may not persist after logout.', {
        duration: 6000,
        style: { background: '#FEFCE8', color: '#713F12', border: '1px solid #FDE047' }
      });

      return { success: true, id: tempId, localOnly: true };
    }
  };

  // ─── Update record ───────────────────────────────────────────────────────
  const updateRecord = async (id, form) => {
    const safeForm = { ...form };
    if (safeForm.photoUrl && safeForm.photoUrl.startsWith('data:')) {
      safeForm._hasPhoto = true;
      safeForm.photoUrl = '';
    }

    try {
      await api.put(`/masters/${type}/${id}`, { data: safeForm });
      const updated = records.map(r => r.id === id ? { ...r, ...safeForm, id } : r);
      setRecords(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error(`[useMasterData] updateRecord failed for "${type}":`, error);
      const updated = records.map(r => r.id === id ? { ...r, ...safeForm, id } : r);
      setRecords(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return { success: true, localOnly: true };
    }
  };

  // ─── Delete record ───────────────────────────────────────────────────────
  const deleteRecord = async (id) => {
    try {
      await api.delete(`/masters/${type}/${id}`);
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error(`[useMasterData] deleteRecord failed for "${type}":`, error);
      // If it's a temp ID (never on server), just remove locally
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return { success: true, localOnly: true };
    }
  };

  // ─── Retry: push any locally-only records to backend ────────────────────
  const syncLocalToBackend = useCallback(async () => {
    const localOnly = records.filter(r => String(r.id).startsWith(`${type}-`));
    if (localOnly.length === 0) return;

    let synced = 0;
    const updatedRecords = [...records];

    for (const rec of localOnly) {
      try {
        const { _localOnly, id: oldId, ...payload } = rec;
        const { data } = await api.post(`/masters/${type}`, { data: payload });
        const idx = updatedRecords.findIndex(r => r.id === oldId);
        if (idx !== -1) updatedRecords[idx] = { ...payload, id: data.id };
        synced++;
      } catch {
        // Leave as local-only, will retry next time
      }
    }

    if (synced > 0) {
      setRecords([...updatedRecords]);
      localStorage.setItem(LS_KEY, JSON.stringify(updatedRecords));
      toast.success(`${synced} record(s) synced to server successfully!`);
    }
  }, [records, type]);

  return {
    records,
    setRecords,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    refresh: fetchRecords,
    syncLocalToBackend,
  };
};
