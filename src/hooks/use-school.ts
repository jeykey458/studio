'use client';

import { useState, useEffect, useMemo } from 'react';
import { SCHOOLS } from '@/lib/constants';
import type { School } from '@/lib/types';

const SCHOOL_STORAGE_KEY = 'baha-selected-school-id';

export function useSchool() {
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSchoolId = localStorage.getItem(SCHOOL_STORAGE_KEY);
      if (storedSchoolId) {
        setSchoolId(storedSchoolId);
      }
    } catch (error) {
      console.error('Could not access localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const setAndStoreSchoolId = (newSchoolId: string | null) => {
    setSchoolId(newSchoolId);
    try {
      if (newSchoolId) {
        localStorage.setItem(SCHOOL_STORAGE_KEY, newSchoolId);
      } else {
        localStorage.removeItem(SCHOOL_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Could not access localStorage', error);
    }
  };
  
  const school = useMemo(() => {
    if (!schoolId) return null;
    return SCHOOLS.find(s => s.id === schoolId) || null;
  }, [schoolId]);

  return { school, setSchool: setAndStoreSchoolId, loading };
}
