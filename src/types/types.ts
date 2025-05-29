export type Currency = {
  label: string;
  name: string;
};
export type Rate = {
  base_code: string | null;
  target_code: string | null;
  conversion_rate: number;
};
export type Pair = {
  id: number;
  base_code: string;
  target_code: string;
};

export type RateRequest = {
  id: number;
  base_code: string;
  target_code: string;
};
