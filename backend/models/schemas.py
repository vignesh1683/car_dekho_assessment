from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class Car(BaseModel):
    id: str
    make: str
    model: str
    variant: str
    year: int
    price_lakh: float
    fuel_type: str
    transmission: str
    body_type: str
    seating_capacity: int
    mileage_kmpl: float
    engine_cc: int
    safety_rating: int
    color_options: List[str]
    features: List[str]
    use_cases: List[str]
    pros: List[str]
    cons: List[str]
    image_url: str
    detailed_specs: Optional[Dict[str, Dict[str, str]]] = None

class FilterParams(BaseModel):
    max_price_lakh: Optional[float] = None
    min_price_lakh: Optional[float] = None
    fuel_type: Optional[str] = None
    body_type: Optional[str] = None
    transmission: Optional[str] = None
    seating_capacity_min: Optional[int] = None
    use_case: Optional[str] = None
    make: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    reply: str
    filters: FilterParams
    matched_cars: List[Car]
    car_summaries: Optional[Dict[str, str]] = None
    top_3_comparison: Optional[str] = None

class CompareRequest(BaseModel):
    car_ids: List[str]
    user_query: Optional[str] = None

class CompareResponse(BaseModel):
    overall_summary: str
    individual_summaries: Dict[str, str]
    ranked_car_ids: List[str]
