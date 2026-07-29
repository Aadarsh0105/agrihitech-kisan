export interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;

  arrival_date: string;

  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface MandiApiResponse {
  total: number;
  count: number;
  limit: number;
  offset: number;

  records: MandiRecord[];
}

export interface MandiFilters {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;

  limit?: number;
  offset?: number;
}

export interface SelectOption {
  label: string;
  value: string;
}