export interface Car {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price_lakh: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  seating_capacity: number;
  mileage_kmpl: number;
  engine_cc: number;
  safety_rating: number;
  color_options: string[];
  features: string[];
  use_cases: string[];
  pros: string[];
  cons: string[];
  image_url: string;
  detailed_specs?: Record<string, Record<string, string>>;
}

export interface FilterParams {
  max_price_lakh?: number;
  min_price_lakh?: number;
  fuel_type?: string | string[];
  body_type?: string | string[];
  transmission?: string;
  seating_capacity_min?: number;
  use_case?: string;
  make?: string | string[];
}

export interface ChatResponse {
  reply: string;
  filters: FilterParams;
  matched_cars: Car[];
  car_summaries?: Record<string, string>;
  top_3_comparison?: string;
}

export interface CompareResponse {
  overall_summary: string;
  individual_summaries: Record<string, string>;
  ranked_car_ids: string[];
}
