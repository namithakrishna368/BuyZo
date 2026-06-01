import { useEffect, useState } from 'react';
import api from '../api/axios';

export const useAuthConfig = () => {
  const [config, setConfig] = useState({ googleOAuth: false, loading: true });

  useEffect(() => {
    api
      .get('/auth/config')
      .then(({ data }) => setConfig({ googleOAuth: data.googleOAuth, loading: false }))
      .catch(() => setConfig({ googleOAuth: false, loading: false }));
  }, []);

  return config;
};
