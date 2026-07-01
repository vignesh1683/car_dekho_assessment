import json
from pathlib import Path
from typing import List, Optional
from models.schemas import Car, FilterParams

# Load data into memory
data_file = Path(__file__).parent.parent / "data" / "cars.json"
with open(data_file, "r") as f:
    CARS_DB = [Car(**car) for car in json.load(f)]

def get_all_cars() -> List[Car]:
    return CARS_DB

def get_car_by_id(car_id: str) -> Optional[Car]:
    for car in CARS_DB:
        if car.id == car_id:
            return car
    return None

def filter_cars(filters: FilterParams) -> List[Car]:
    filtered_cars = CARS_DB
    
    if filters.max_price_lakh:
        filtered_cars = [c for c in filtered_cars if c.price_lakh <= filters.max_price_lakh]
    if filters.min_price_lakh:
        filtered_cars = [c for c in filtered_cars if c.price_lakh >= filters.min_price_lakh]
    if filters.fuel_type:
        filtered_cars = [c for c in filtered_cars if c.fuel_type.lower() == filters.fuel_type.lower()]
    if filters.body_type:
        filtered_cars = [c for c in filtered_cars if c.body_type.lower() == filters.body_type.lower()]
    if filters.transmission:
        filtered_cars = [c for c in filtered_cars if c.transmission.lower() == filters.transmission.lower()]
    if filters.seating_capacity_min:
        filtered_cars = [c for c in filtered_cars if c.seating_capacity >= filters.seating_capacity_min]
    if filters.use_case:
        filtered_cars = [c for c in filtered_cars if any(filters.use_case.lower() in uc.lower() for uc in c.use_cases)]
        
    return filtered_cars
