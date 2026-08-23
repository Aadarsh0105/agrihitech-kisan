import { useEffect, useState } from 'react';
import { COMPANY_DATA_CHANGED } from '../services/company-local.service';
import { DEALER_DATA_CHANGED } from '../services/dealer-local.service';

export function useDealerData<T>(read: () => T) { const [data, setData] = useState(read); useEffect(() => { const sync = () => setData(read()); window.addEventListener(DEALER_DATA_CHANGED, sync); window.addEventListener(COMPANY_DATA_CHANGED, sync); return () => { window.removeEventListener(DEALER_DATA_CHANGED, sync); window.removeEventListener(COMPANY_DATA_CHANGED, sync); }; }, [read]); return data; }
