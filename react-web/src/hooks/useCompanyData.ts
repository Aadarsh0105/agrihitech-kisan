import { useEffect, useState } from 'react';
import { COMPANY_DATA_CHANGED } from '../services/company-local.service';

export function useCompanyData<T>(read: () => T) {
  const [data, setData] = useState(read);
  useEffect(() => { const sync = () => setData(read()); window.addEventListener(COMPANY_DATA_CHANGED, sync); return () => window.removeEventListener(COMPANY_DATA_CHANGED, sync); }, [read]);
  return data;
}
