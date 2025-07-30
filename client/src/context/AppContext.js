import { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api/api';
import { toast } from 'react-toastify';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [role, setRole] = useState('Admin'); // 'Admin' or 'User'
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getPages();
      setPages(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch pages.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const value = {
    pages,
    setPages,
    role,
    setRole,
    loading,
    fetchPages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
