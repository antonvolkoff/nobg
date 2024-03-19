import { useState, useEffect } from 'react';

export default function useLocalStorageState(key, initialState) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const value = localStorage.getItem(key);
    if (!value) return;

    setState(JSON.parse(value));
  }, [key]);

  useEffect(() => {
    if (state == initialState) return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
};
